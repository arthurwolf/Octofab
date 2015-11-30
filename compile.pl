#!/usr/bin/perl
use strict;
use WWW::Mechanize;
use HTML::TreeBuilder;
use File::Slurp;
use utf8;

# Step 0, set context
my $octoprint = "http://localhost:5000";

# Step 1, get the octoprint page

my $mech = WWW::Mechanize->new();
$mech->get( $octoprint );

# Step 2, get an array of lines

my @lines = split("\n", $mech->content);

# Step 3, find every tag to replace
my @scripts_inlined;
for my $may_be_a_script ( @lines ){
    if( $may_be_a_script =~ m{script.*static} ){
        # Get the URL for this script
        my $url = $octoprint . HTML::TreeBuilder->new_from_content( $may_be_a_script )->look_down( _tag => "script", src => qr/static/ )->attr("src");
        
        # Get the file's contents 
        $mech->get($url); 
        
        # Inline
        push @scripts_inlined, "<script type='text/javascript'>\n" . $mech->content . "\n</script>\n";
    }elsif( $may_be_a_script =~ m{link.*static.*stylesheet} ){
        # Get the HTML element
        my $element = HTML::TreeBuilder->new_from_content( $may_be_a_script )->look_down( _tag => "link", href => qr/static/ );
        
        # Get the URL for this stylesheet
        my $url = $octoprint . $element->attr("href");
        
        # Get the file's contents 
        $mech->get($url); 
        
        # Inline
        push @scripts_inlined, "<style rel='" . $element->attr("rel") . "'>\n" . $mech->content . "\n</style>\n";
 
    }elsif( $may_be_a_script =~ m{</body>} ){
        # Insert the worker script
        if( 1 ){
            # Get the file's content
            my $content = read_file("OctoPrint/src/octoprint/static/gcodeviewer/js/Worker.js");

            # Make the new tag
            my $tag = HTML::Element->new('script', type => "javascript/worker", id => "inlineworker");
            $tag->push_content($content);
           
            # Add to the HTML file 
            push @scripts_inlined, $tag->as_HTML();
        }

        # Insert all our custom scripts 
        for my $jsfile ( split("\n", `ls src/js/*`) ){
            # Get the file's content
            my $content = read_file($jsfile);

            # Make the new tag
            my $tag = HTML::Element->new('script', type => "text/javascript");
            $tag->push_content($content);
           
            # Add to the HTML file 
            push @scripts_inlined, $tag->as_HTML();
        }
        
        push @scripts_inlined, $may_be_a_script; 
    }else{
        push @scripts_inlined, $may_be_a_script; 
    }
}

# Final step, dump the whole file
open( my $fh, '>', 'index.html' );
binmode $fh, ':encoding(UTF-8)';
print $fh join("\n", @scripts_inlined);
close $fh;

system("python smoothie-upload.py index.html 192.168.0.18");





