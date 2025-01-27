var docs = {};

docs.getDocHTML = function(version){
    var html = '<!DOCTYPE html>\n' +
        '<html>\n' +
        '  <head>\n' +
        '    <title>Digital Realty Backend API - Documentation</title>\n' +
        '    <!-- needed for adaptive design -->\n' +
        '    <meta charset="utf-8"/>\n' +
        '    <meta name="viewport" content="width=device-width, initial-scale=1">\n' +
        '    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui.css" crossorigin />\n' +
        '\n' +
        '    <style>\n' +
        '      body {\n' +
        '        margin: 0;\n' +
        '        padding: 0;\n' +
        '      }\n' +
        '    </style>\n' +
        '  </head>\n' +
        '  <body>\n' +
        '    <div id="swagger-ui"></div>\n' +
        '    <script src="https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui-bundle.js" crossorigin></script>\n' +
        '    <script>\n'+
        '       window.onload = () => {\n'+
        '           window.ui = SwaggerUIBundle({\n'+
        '             url: "/api/spec/api-docs.yaml",\n'+
        '             dom_id: "#swagger-ui",\n'+
        '           });\n'+
        '       };\n'+
        '    </script>\n'+
        '    <script>\n'+
        '       var checkExist1 = setInterval(function () {\n'+
        '          if (document.getElementsByClassName("authorize unlocked btn")[0] != null) {\n'+
        '              clearInterval(checkExist1);\n'+
        '              document.getElementsByClassName("authorize unlocked btn")[0].onclick = function(){\n'+
        '                   var checkExist2 = setInterval(function() {\n'+
        '                       if (document.getElementsByClassName("btn modal-btn auth authorize button")[0] != null) {\n'+
        '                           clearInterval(checkExist2);\n'+
        '                           document.getElementsByClassName("btn modal-btn auth authorize button")[0].onclick = function(){\n'+
        '                               var username = document.getElementsByName("username")[0].value\n'+
        '                               var password = document.getElementsByName("password")[0].value\n'+
        '                               document.getElementsByClassName("btn modal-btn auth btn-done button")[0].click();\n'+
        '                               document.getElementById("operations-Authentication-post_login").scrollIntoView({behavior: "smooth"});\n'+
        '                               if (document.getElementById("operations-Authentication-post_login").className.indexOf("is-open") === -1){\n'+
        '                                   document.getElementById("operations-Authentication-post_login").children[0].children[0].click();\n'+
        '                               }\n'+
        '                               var checkExist3 = setInterval(function() {\n'+
        '                                   if (document.getElementById("operations-Authentication-post_login").children[1].children[0].children[0].children[0].children[1].children[0]) {\n'+
        '                                       clearInterval(checkExist3);\n'+
        '                                       if (document.getElementById("operations-Authentication-post_login").children[1].children[0].children[0].children[0] && document.getElementById("operations-Authentication-post_login").children[1].children[0].children[0].children[0].children[1] && document.getElementById("operations-Authentication-post_login").children[1].children[0].children[0].children[0].children[1].children[0].className.indexOf("cancel") === -1){\n'+
        '                                           document.getElementById("operations-Authentication-post_login").children[1].children[0].children[0].children[0].children[1].children[0].click();\n'+
        '                                       }\n'+
        '                                       let content = \'{"username": "\'+username+\'", "password": "\'+password+\'"}\'\n;' +
        '                                       var nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;\n'+
        '                                       var input = document.getElementById("operations-Authentication-post_login").children[1].children[0].children[0].children[2].children[1].children[0].children[0].children[0].children[0]\n' +
        '                                       nativeInputValueSetter.call(input, content);\n'+
        '                                       var ev2 = new Event("input", { bubbles: true});\n'+
        '                                       input.dispatchEvent(ev2);\n'+
        //'                                       document.getElementById("operations-Authentication-post_login").children[1].children[0].children[0].children[2].children[1].children[0].children[0].children[0].children[0].value = content;\n'+
        '                                   }\n'+
        '                               }, 100);\n'+
        '                           }\n'+
        '                       }\n'+
        '                   }, 100);\n'+
        '               }\n'+
        '           }\n'+
        '       }, 100);\n'+
        '     </script>\n'+
        '  </body>\n' +
        '</html>';
    return html;
};

module.exports = docs;