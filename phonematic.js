
var phonetic_map = {
    "A": "Alpha",
    "B": "Bravo",
    "C": "Charlie",
    "D": "Delta",
    "E": "Echo",
    "F": "Foxtrot",
    "G": "Golf",
    "H": "Hotel",
    "I": "India",
    "J": "Juliet",
    "K": "Kilo",
    "L": "Lima",
    "M": "Mike",
    "N": "November",
    "O": "Oscar",
    "P": "Papa",
    "Q": "Quebec",
    "R": "Romeo",
    "S": "Sierra",
    "T": "Tango",
    "U": "Uniform",
    "V": "Victor",
    "W": "Whiskey",
    "X": "X-Ray",
    "Y": "Yankee",
    "Z": "Zulu",
    "0": "Zee-roh",
    "1": "Wun",
    "2": "Too",
    "3": "Tree",
    "4": "Fo-wer",
    "5": "Fife",
    "6": "Six",
    "7": "Sev-en",
    "8": "Ait",
    "9": "Nin-er",
    "/": "Slash",
}

var morse_alphabet = {
    'A': '.-',    'B': '-...',  'C': '-.-.', 'D': '-..',
    'E': '.',     'F': '..-.',  'G': '--.',  'H': '....',
    'I': '..',    'J': '.---',  'K': '-.-',  'L': '.-..',
    'M': '--',    'N': '-.',    'O': '---',  'P': '.--.',
    'Q': '--.-',  'R': '.-.',   'S': '...',  'T': '-',
    'U': '..-',   'V': '...-',  'W': '.--',  'X': '-..-',
    'Y': '-.--',  'Z': '--..',  ' ': '/', '/': '-..-.',
    '1': '.----', '2': '..---', '3': '...--', '4': '....-', 
    '5': '.....', '6': '-....', '7': '--...', '8': '---..', 
    '9': '----.', '0': '-----', 
}

function translate_callsign(input){
    var input = input.toUpperCase();
    var out = "";

    pattern = /(?<op_country>\w{0,2}\/)?(?<callsign>\w+)(?<mode>\/\w+)?/g;
    matcher = RegExp(pattern);
    matches = matcher.exec(input).groups;

    country_content = "";
    callsign_content = "";
    mode_out = "";
    morse_content="";

    if (matches.op_country != null){
        country_content = "<h3>Operating Country</h3>"
        for (i=0; i < matches.op_country.length; i++){
            var token = matches.op_country[i];
            parsed_token = phonetic_map[token];
            morse_char = morse_alphabet[token];
            morse_content = morse_content.concat(`<span> ${morse_char} </span>`)
            country_content = country_content.concat(`<span style="color:red;"> ${parsed_token} </span>`)
        }

        // Look up the operating country for additional info
        op_entity = get_entity(matches.op_country);
        country_content = country_content.concat(`<p>${morse_content}</p>`)
        country_content = country_content.concat(`<p> ${op_entity.flag} ${op_entity.name} </p>`)
        country_content = country_content.concat(`<p> CQ: ${op_entity.cq} ITU: ${op_entity.itu} </p>`)

    }

    callsign_content = "<h3>Callsign</h3>"
    morse_content=""
    for (i=0; i < matches.callsign.length; i++){
        
        var token = matches.callsign[i];
        var parsed_token = "";
    
        if (token == "/"){
            parsed_token = token;
        }
        else {
            parsed_token = phonetic_map[token];
            morse_char = morse_alphabet[token];
        }
        callsign_content = callsign_content.concat(`<span> ${parsed_token} </span>`)
        morse_content = morse_content.concat(`<span> ${morse_char} </span>`)
    }
    callsign_content = callsign_content.concat(`<p>${morse_content}</p>`)

    call_entity = get_entity(matches.callsign);
            // Look up the operating country for additional info
    callsign_content = callsign_content.concat(`<p> ${call_entity.flag} ${call_entity.name} </p>`)
    callsign_content = callsign_content.concat(`<p> CQ: ${call_entity.cq} ITU: ${call_entity.itu} </p>`)

    if (matches.mode != null){
        mode_out = "";
        switch(matches.mode) {
            case "/MM":
                mode_out = "<h3>Operating Mode</h3>"
                parsed_token = " Maritime Mobile 🛥️";
                break;
            case "/P":
                mode_out = "<h3>Operating Mode</h3>"
                parsed_token = " Portable 🥾";
                break;
            case "/QRP":
                mode_out = "<h3>Operating Mode</h3>"
                parsed_token = " Low-Power 🪫";
                break;
            case "/M":
                mode_out = "<h3>Operating Mode</h3>"
                parsed_token = " Mobile 🚗";
                break;
            case "/A":
                mode_out = "<h3>Operating Mode</h3>"
                parsed_token = " Alternative ";
                break;
            default:
                parsed_token = "";
        }
        mode_out = mode_out.concat(`<span style="color:blue;"> ${parsed_token} </span>`)        
    }

    document.getElementById('country_output').innerHTML = country_content;
    document.getElementById('callsign_output').innerHTML = callsign_content;
    document.getElementById('mode_output').innerHTML = mode_out;
    return true;
}


function get_entity(callsign){
    
    for(i=0; i < dxcc.dxcc.length;i++){
        var entity = dxcc.dxcc[i];
        if (entity.prefixRegex != ""){
            mt = new RegExp(entity.prefixRegex);
            m = mt.exec(callsign);
            if (m != null && m.length > 0){
            console.log("Match! ",  entity.name);
            return entity;
        }
       }
    }
}

document.addEventListener("DOMContentLoaded", function(e) {
    phonetics = ""
    c = 0;
    row = ""
    for (const [key, value] of Object.entries(phonetic_map)){
        row = row.concat(`<td>${key} : ${value}</td>`)
        c++;
        if (c % 4 == 0){
            phonetics = phonetics.concat(`<tr> ${row} </tr>`);
            row = "";
        }
    }
    phonetics = phonetics.concat(`<tr> ${row} </tr>`);
    document.getElementById('phonetics').innerHTML = phonetics;
  });
