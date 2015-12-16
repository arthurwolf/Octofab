var global_sockjs;
var smoothie;

var blob = new Blob([document.querySelector('#inlineworker').textContent]);
GCODE_WORKER = window.URL.createObjectURL(blob);

function SockJS(uri, what, options){
    global_sockjs = this;
    this.callback = undefined;

    this.on_ajax_connect = function(){
        var _onmessage = this.onmessage;
        this.callback = function (data) { _onmessage(data); }; 
        
        //console.log("false sockjs calls"); 
        this.callback.call(undefined, {"type":"message","data":{"connected":{"display_version":DISPLAY_VERSION,"apikey":"A6977F02830F4154AD3B123F3A67FCB1","version":VERSION,"branch":BRANCH,"plugin_hash":"f88be250e0099eeecbf10a90bb32fa4b"}}});

        this.callback.call(undefined,{"type":"message","data":{"history":{"logs":[],"offsets":{},"serverTime":1448466981.314448,"messages":[],"state":{"text":"Offline","flags":{"operational":false,"paused":false,"printing":false,"sdReady":false,"error":false,"ready":false,"closedOrError":true}},"temps":[],"job":{"estimatedPrintTime":null,"filament":{"volume":null,"length":null},"file":{"origin":null,"date":null,"name":null,"size":null},"lastPrintTime":null},"currentZ":null,"progress":{"completion":null,"printTime":null,"filepos":null,"printTimeLeft":null}}}}); 

        this.callback.call(undefined,{"type":"message","data":{"event":{"type":"ClientOpened","payload":{"remoteAddress":"127.0.0.1"}}}});

        this.callback.call(undefined,{"type":"message","data":{"timelapse":null}});

        smoothie.update_octoprint();

    }; 

}

// Catch all ajax calls, and intercept those to the API
$.ajaxPrefilter(function( options, originalOptions, jqXHR ){

    // If this is an API call
    if( options.url.substr(0,5) == "/api/" || options.url.substr(0,8) == "/sockjs/" ){
        var answer = '';
        var originalSuccess = originalOptions.success || options.success;
        var next = function (data) { originalSuccess(data); }; 

        switch( options.url ){
            case '/api/printerprofiles':
                answer = {"profiles": {"_default": {"axes": {"e": {"inverted": false, "speed": 300}, "x": {"inverted": false, "speed": 6000}, "y": {"inverted": false, "speed": 6000}, "z": {"inverted": false, "speed": 200}}, "color": "default", "current": true, "default": true, "extruder": {"count": 1, "nozzleDiameter": 0.4, "offsets" : [[0.0, 0.0]]}, "heatedBed": false, "id": "_default", "model": "Generic RepRap Printer", "name": "Default" , "resource": "http://localhost:5000/api/printerprofiles/_default", "volume": {"depth": 200.0, "formFactor": "rectangular", "height": 200.0, "origin": "lowerleft", "width": 200.0}}}};
                break;
            case '/api/slicing':
                answer = {"cura": {"configured": null, "default": true, "displayName": "CuraEngine", "key": "cura", "profiles": {}}};
                break;
            case '/api/timelapse':
                answer = {"config": {"type": "off"}, "files": []};
                break;
            case '/api/settings':
                answer = {"api": {"allowCrossOrigin": false, "enabled": true, "key": "3E6096E0773A41B8A13E8C18AB45FB86"}, "appearance": {"color": "default", "colorTransparent": false, "defaultLanguage": "_default", "name": ""}, "feature": {"alwaysSendChecksum": false, "externalHeatupDetection": true, "gcodeViewer": true, "ignoreIdenticalResends": false, "keyboardControl": true, "pollWatched": false, "repetierTargetTemp": false, "sdAlwaysAvailable": false, "sdSupport": true, "swallowOkAfterResend": true, "temperatureGraph": true, "waitForStart": false}, "folder": {"logs": "/home/arthur/.octoprint/logs", "timelapse": "/home/arthur/.octoprint/timelapse", "timelapseTmp": "/home/arthur/.octoprint/timelapse/tmp", "uploads": "/home/arthur/.octoprint/uploads", "watched": "/home/arthur/.octoprint/watched"}, "plugins": {"cura": {"cura_engine": null, "debug_logging": false, "default_profile": null}, "discovery": {"httpPassword": null, "httpUsername": null, "model": {"description": null, "name": null, "number": null, "serial": null, "url": null, "vendor": null, "vendorUrl": null}, "pathPrefix": null, "publicHost": null, "publicPort": null, "upnpUuid": "7308331a-6ae9-41c2-a9fc-cc1e6c70e550", "zeroConf": []}, "pluginmanager": {"dependency_links": false, "hidden": [], "pip": null, "pip_args": null, "repository": "http://plugins.octoprint.org/plugins.json", "repository_ttl": 1440}, "softwareupdate": {"cache_ttl": 1440, "check_providers": {}, "octoprint_checkout_folder": null, "octoprint_type": "github_release", "pip_command": null}}, "printer": {"defaultExtrusionLength": 5}, "scripts": {"gcode": {"afterPrintCancelled": "; disable motors\nM84\n\n;disable all heaters\n{% snippet 'disable_hotends' %}\nM140 S0\n\n;disable fan\nM106 S0", "snippets/disable_hotends": "{% for tool in range(printer_profile.extruder.count) %}M104 T{{ tool }} S0\n{% endfor %}"}}, "serial": {"additionalPorts": [], "autoconnect": false, "baudrate": null, "baudrateOptions": [250000, 230400, 115200, 57600, 38400, 19200, 9600], "log": false, "longRunningCommands": ["G4", "G28", "G29", "G30", "G32"], "port": null, "portOptions": [], "timeoutCommunication": 30.0, "timeoutConnection": 10.0, "timeoutDetection": 0.5, "timeoutSdStatus": 1.0, "timeoutTemperature": 5.0}, "server": {"commands": {"serverRestartCommand": null, "systemRestartCommand": null, "systemShutdownCommand": null}, "diskspace": {"critical": 209715200, "warning": 524288000}}, "system": {"actions": [], "events": null}, "temperature": {"cutoff": 30, "profiles": [{"bed": 100, "extruder": 210, "name": "ABS"}, {"bed": 60, "extruder": 180, "name": "PLA"}]}, "terminalFilters": [{"name": "Suppress M105 requests/responses", "regex": "(Send: M105)|(Recv: ok (B|T\\d*):)"}, {"name": "Suppress M27 requests/responses", "regex": "(Send: M27)|(Recv: SD printing byte)"}], "webcam": {"bitrate": "5000k", "ffmpegPath": null, "ffmpegThreads": 1, "flipH": false, "flipV": false, "rotate90": false, "snapshotUrl": null, "streamUrl": null, "watermark": true}};
                break;
            case '/api/connection':
                answer = {"current": {"baudrate": null, "port": null, "printerProfile": "_default", "state": "Closed"}, "options": {"baudratePreference": null, "baudrates": [250000, 230400, 115200, 57600, 38400, 19200, 9600], "portPreference": null, "ports": [], "printerProfilePreference": "_default", "printerProfiles": [{"id": "_default", "name": "Default"}]}};
                 global_sockjs.on_ajax_connect();
                var originalSuccess = originalOptions.success || options.success;
                var next = function (data) { originalSuccess(data); }; 
                next.call(undefined, answer);
                jqXHR.abort();
                return;
               break;
            case '/api/printer/command/custom':
                answer = {"controls": []};
                break;
            case '/api/files':
                smoothie.get_file_list(next);
                jqXHR.abort();
                return;
            case '/api/slicing/cura/profiles':
                answer = {};
                break;
            case '/sockjs/info':
                answer = {"entropy":5050561905883750511,"websocket":true,"origins":["*:*"],"cookie_needed":true};
               break;
            case '/api/logs':
                answer ={"files": [{"date": 1448405215, "name": "octoprint.log", "refs": {"download": "http://localhost:5000/downloads/logs/octoprint.log", "resource": "http://localhost:5000/api/logs/octoprint.log"}, "size": 22993}, {"date": 1448312671, "name": "plugin_cura_engine.log", "refs": {"download": "http://localhost:5000/downloads/logs/plugin_cura_engine.log", "resource": "http://localhost:5000/api/logs/plugin_cura_engine.log"}, "size": 0}, {"date": 1448312670, "name": "serial.log", "refs": {"download": "http://localhost:5000/downloads/logs/serial.log", "resource": "http://localhost:5000/api/logs/serial.log"}, "size": 0}, {"date": 1448312671, "name": "plugin_pluginmanager_console.log", "refs": {"download": "http://localhost:5000/downloads/logs/plugin_pluginmanager_console.log", "resource": "http://localhost:5000/api/logs/plugin_pluginmanager_console.log"}, "size": 0}], "free": 413871190016, "total": 1871855992832};
                break;
            case '/api/login':
                answer = {"active": true, "admin": true, "apikey": null, "name": "dummy", "settings": {}, "user": true};
                break;
            case '/api/printer/command':
                smoothie.send_command(JSON.parse(options.data),next);
                jqXHR.abort();
                break;
            case '/api/printer/tool':
                smoothie.control_command(JSON.parse(options.data),next);
                jqXHR.abort();
                break;
            case '/api/printer/printhead':
                smoothie.control_command(JSON.parse(options.data),next);
                jqXHR.abort();
                break;
            case '/api/printer/bed':
                smoothie.control_command(JSON.parse(options.data),next);
                jqXHR.abort();
                break;
        }

        if( answer == '' ){ return; }
        next.call(undefined, answer);

        jqXHR.abort(); 
    }else if(options.url.substr(0,9) == '/file/sd/' ){
        console.log("file selected for action : " + options.url);
        console.log(options);
        jqXHR.abort();
    }else if(options.url.substr(0,8) == '/command' ){
        console.log("calling smoothie /command");
     }else if(options.url.substr(0,7) == '/upload' ){
        console.log("calling smoothie /upload");
    }else{
        console.log("unknown ajax call, ignoring " + options.url);
        jqXHR.abort();
    }

});


function Smoothie(){

    var that = this;
    this.initialized = false;
    this.file_list = [];
    this.terminal_buffer = [];
    this.current_temperatures = {};

    this.initialize = function(){
        if( !this.initialized ){
            this.initialized = true; 
            this.on_page_loaded(); 
            this.log("Smoothie interface loaded");
        }
    };

    this.on_page_loaded = function(){
    };

    this.get_file_list = function(success_function){
        $.post('/command', "ls -s /sd/\n").done(function(data){
            that.file_list = []; 
            data.split("\n").map(function(item){
                if( item == '' ){ return; }
                var name = item.split(' ')[0];
                var size = item.split(' ')[1];
                that.file_list.push({
                    "date":             1448398410,
                    "gcodeAnalysis":    {"estimatedPrintTime":0, "filament":{ "tool0":{ "length":0, "volume":0 } } },
                    "hash":             "no hash",
                    "links":            [],
                    "name":             name,
                    "origin":           "local",
                    "refs":             { "download":"/sd/" + name, "resource":"/file/sd/" + name },
                    "size":             size,
                    "type":             "machinecode"
                });
            });
            answer = {"files": smoothie.file_list, "free": 0, "total": 0};
            success_function.call(undefined, answer);
        });
    };

    this.log = function( message ){
        this.terminal_buffer.push(message);
    };

    this.send_command = function(passed_data, next){
        var command = passed_data.command;
        that.terminal_buffer.push("Send: " + command); 
        $.post('/command', command + "\n").done(function(data){
            that.terminal_buffer.push("Recv: " + data.replace(/[\r\n]*$/g,"")); 
            that.update_octoprint();
        });
    };

    this.update_octoprint = function(){
        if( global_sockjs.callback == undefined ){ return; }
        var date = new Date();
        global_sockjs.callback.call(undefined,{"type":"message","data":{"current":{"logs":this.terminal_buffer,"offsets":{},"serverTime":date.getTime(),"busyFiles":[],"messages":[],"job":{"file":{"origin":null,"date":null,"name":null,"size":null},"estimatedPrintTime":null,"averagePrintTime":null,"filament":null,"lastPrintTime":null},"temps":[that.current_temperatures],"state":{"text":"Operational","flags":{"operational":true,"paused":false,"printing":false,"sdReady":true,"error":false,"ready":true,"closedOrError":false}},"currentZ":null,"progress":{"completion":0,"printTimeLeft":null,"printTime":null,"filepos":null}}}});
        this.terminal_buffer = [];
    };

    this.control_command = function( passed_data, next ){
        console.log(passed_data);
        var command = '';
        var params =[];
        switch( passed_data.command ){
            case 'jog':
                ['x','y','z'].forEach(function(axis){ if(passed_data[axis] != undefined){ params.push(axis.toUpperCase() + passed_data[axis]); } });
                command = "G91\nG1 " + params.join(" ") + "\nG90";
                break;
            case 'extrude':
                command = "M83\nG1 E" + passed_data.amount + "\nM82";
                break;
            case 'feedrate':
                command = "M220 S" + passed_data.factor;
                break;
            case 'flowrate':
                command = "M221 S" + passed_data.factor;
                break;
            case 'home':
                passed_data.axes.forEach(function(axis){ params.push(axis.toUpperCase() + "0"); });
                command = "G28 " + params.join(" ");
                break;
            case 'select':
                break;
            case 'target':
                break;
        } 
        this.send_command({'command': command}, undefined); 
    
    };

    this.update_tick = function(){
        that.log("Send: M105");
        $.post('/command', "M105\n").done(function(data){
            that.log("Recv: " + data.replace(/[\r\n]*$/g,""));
            that.current_temperatures = {};
            data.split('@').forEach(function(reading){
                var values = reading.split(/[\s\:\/]/);
                if( values[1] == '' ){ return; }
                var letter = values[1];
                var temp   = values[2];
                var target = values[4];
                var name = {"T":"tool0","B":"bed"}[letter];
                that.current_temperatures[name] = {"actual":temp, "target": target};
            });
            var date = new Date();
            that.current_temperatures["time"] = date.getTime();
            that.update_octoprint();
        });
    };
    setInterval(function(){ that.update_tick(); }, 5000);

}

smoothie = new Smoothie();
smoothie.initialize();



