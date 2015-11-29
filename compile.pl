#!/usr/bin/perl
use strict;
use WWW::Mechanize;
use HTML::TreeBuilder;
use File::Slurp;

# Step 0, set context
my $octoprint = "http://localhost:5000";

# Step 1, get the octoprint page

my $mech = WWW::Mechanize->new();
$mech->get( $octoprint );

# Step 2, build a tree

my $root = HTML::TreeBuilder->new_from_content( $mech->content );

# Step 3, find and include all scripts

for my $script ( $root->look_down( _tag => "script", src => qr/static/ ) ){
    # Get the filename 
    my $src = $script->attr("src");
    
    # Remove the src attribute 
    $script->attr( src => undef );

    # Get the remote content
    $mech->get( $octoprint . $src );

    # Insert the content into the tag
    $script->push_content( $mech->content );

}

# Step 4, find and include all the stylesheets

for my $style ( $root->look_down( _tag => "link", href => qr/webassets/ )){
    # Get the filename 
    my $src = $style->attr("href");
 
    # Remove the href attribute
    $style->attr( href => undef );

    # Change the tag
    $style->tag("style");

    # Get the remote content
    $mech->get( $octoprint . $src );

    # Insert the content into the tag
    $style->push_content( $mech->content );

}

# Step 5, insert custom scripts

for my $jsfile ( split("\n", `ls src/js/*`) ){
    # Get the file's content
    my $content = read_file($jsfile);

    # Make the new tag
    my $tag = HTML::Element->new('script', type => "text/javascript");
    $tag->push_content($content);

    # Find the body
    my $body = [$root->look_down( _tag => 'body' )]->[0];
    
    # Add to the end of the body
    $body->push_content($tag);
}

# Final step, dump the whole file
#write_file('test.html', $root->as_HTML());
print $root->as_HTML('', '    '), "\n";

# Tidy the file
#system("tidy -i -utf8 -q -m test.html");



