/*
 * Copyright (c) 2012 Adobe Systems Incorporated. All rights reserved.
 *  
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"), 
 * to deal in the Software without restriction, including without limitation 
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the 
 * Software is furnished to do so, subject to the following conditions:
 *  
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *  
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
 * DEALINGS IN THE SOFTWARE.
 * 
 */


/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, $, CSSLint, brackets */

/**
 * Provides JSLint results via the core linting extension point
 */
define(function (require, exports, module) {
    "use strict";
    
    // Load CSSLint, a non-module lib
    require("thirdparty/csslint");
    
    // Load dependent modules
    var AppInit         = brackets.getModule("utils/AppInit"),
        CodeInspection  = brackets.getModule("language/CodeInspection");
    
    var ALL_RULES = [
        "ids",
        "errors",
        "floats",
        "import",
        "box-model",
        "gradients",
        "important",
        "shorthand",
        "box-sizing",
        "font-faces",
        "font-sizes",
        "zero-units",
        "empty-rules",
        "rules-count",
        "text-indent",
        "outline-none",
        "selector-max",
        "vendor-prefix",
        "fallback-colors",
        "regex-selectors",
        "unique-headings",
        "known-properties",
        "adjoining-classes",
        "qualified-headings",
        "star-property-hack",
        "universal-selector",
        "duplicate-properties",
        "bulletproof-font-face",
        "overqualified-elements",
        "unqualified-attributes",
        "selector-max-approaching",
        "underscore-property-hack",
        "display-property-grouping",
        "compatible-vendor-prefixes",
        "duplicate-background-images"
    ];
    
    /**
     * Run CSSLint on the current document. Reports results to the main UI. Displays
     * a gold star when no errors are found.
     */
    function lintOneFile(text, fullPath) {
        var results = CSSLint.verify(text, ALL_RULES),
            messageObjs = results.messages,
            errors = messageObjs.map(function (messageObj) {
                var position = { line: messageObj.line - 1, ch: messageObj.col - 1 },
                    message = messageObj.message,
                    type;
                
                switch (messageObj.type) {
                case "error":
                    type = CodeInspection.Type.ERROR;
                    break;
                case "warning":
                    type = CodeInspection.Type.WARNING;
                    break;
                default:
                    type = CodeInspection.Type.META;
                }
    
                return {
                    pos: position,
                    message: message,
                    type: type
                };
            });
        
        return { errors: errors };
    }
    
    AppInit.appReady(function () {
        // Register for CSS files
        CodeInspection.register("css", {
            name: "CSSLint",
            scanFile: lintOneFile
        });
    });
});
