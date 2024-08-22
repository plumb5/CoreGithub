var href_Arr = [];
var tag_Arr = [];
var img_Title = [];
var ddlContactFields = '';


$(document).ready(function () {
    DragDroReportUtil.Getlmscustomfields()
    GetContactFielddragdrop('Emailnew');
    setTimeout(function () {
        DragDroReportUtil.GetReport();
    }, 5000);

    GetMailImages();

});
var defaultContactFields = ["Name", "EmailId", "PhoneNumber", "Location", "Gender", "MaritalStatus", "Education", "Occupation", "Interests", "Signatory_Name", "Signatory_EmailId", "Signatory_PhoneNumber", "Signatory_BusinessPhoneNumber"];
const block_list = [{
    id: "title",
    label: '<div class="panel__body sidebar__module  SidebarModule_sidebarModule__2aVdj " data-qa="sidebar-module"><div class="image-drag SidebarModule_imageDrag__z7ned"><i class="fa fa-header" aria-hidden="true"></i></div><div class="body__title body__title--cs SidebarModule_sidebarModuleTitle__TnK1l"><span>Heading</span></div></div>',
    content: `<h1 contentEditable>This is a simple title</h1>`,
}, {
    id: "text",
    label: '<div class="panel__body sidebar__module  SidebarModule_sidebarModule__2aVdj " data-qa="sidebar-module"><div class="image-drag SidebarModule_imageDrag__z7ned"><i class="fa fa-paragraph" aria-hidden="true"></i></div><div class="body__title body__title--cs SidebarModule_sidebarModuleTitle__TnK1l"><span>Paragraph</span></div></div>',
    content: `<p  contentEditable data-gjs-type="text">Insert your text here</p>`,
}, {
    id: "Link",
    label: '<div class="panel__body sidebar__module  SidebarModule_sidebarModule__2aVdj " data-qa="sidebar-module"><div class="image-drag SidebarModule_imageDrag__z7ned"><i class="fa fa-link" title="Image Link"></i></div><div class="body__title body__title--cs SidebarModule_sidebarModuleTitle__TnK1l"><span>Image Link</span></div></div>',
    content: '<a name="Link" p5_btn="false" style="display: inline-block; min-width: 100px; min-height: 40px; padding:10px" data-link-code></a>',
    droppable: true,
}, {
    id: "image",
    label: '<div class="panel__body sidebar__module  SidebarModule_sidebarModule__2aVdj " data-qa="sidebar-module"><div class="image-drag SidebarModule_imageDrag__z7ned"><i class="fa fa-picture-o" aria-hidden="true"></i></div><div class="body__title body__title--cs SidebarModule_sidebarModuleTitle__TnK1l"><span>Image</span></div></div>',
    select: true,

    content: {
        type: "image",
    },

    activate: true,
}, {
    id: "btn",
    label: '<div class="panel__body sidebar__module  SidebarModule_sidebarModule__2aVdj " data-qa="sidebar-module"><div class="image-drag SidebarModule_imageDrag__z7ned"><i class="fa fa-minus-square" aria-hidden="true"></i></div><div class="body__title body__title--cs SidebarModule_sidebarModuleTitle__TnK1l"><span>Button</span></div></div>',
    content: '<div><a p5_btn="true" href="#" contenteditable="true" style="display: inline-block; background-color: #4CAF50; border: none; color: white; padding: 12px 24px; text-align: center; text-decoration: none; font-size: 16px; margin: 4px 2px; cursor: pointer; border-radius: 4px;" data-link-code>Click me</a></div>',
}, {
    id: "divider",
    label: '<div class="panel__body sidebar__module  SidebarModule_sidebarModule__2aVdj " data-qa="sidebar-module"><div class="image-drag SidebarModule_imageDrag__z7ned"><i class="fa fa-pause dividal" aria-hidden="true"></i></div><div class="body__title body__title--cs SidebarModule_sidebarModuleTitle__TnK1l"><span>Divider</span></div></div>',
    content: `
<div class="dividerwrap" style="width:100%; min-width:30px;">
<div style="height:1px; background-color:#ccc;"></div>
</div>
<style>
  .divider {
    background-color: rgba(0, 0, 0, 0.1);
    height: 1px;
  }
</style>
`,
}, {
    id: "spacer",
    label: '<div class="panel__body sidebar__module  SidebarModule_sidebarModule__2aVdj " data-qa="sidebar-module"><div class="image-drag SidebarModule_imageDrag__z7ned"><i class="fa fa-arrows-v" aria-hidden="true"></i></div><div class="body__title body__title--cs SidebarModule_sidebarModuleTitle__TnK1l"><span>Spacer</span></div></div>',
    content: `<div style="height:20px;outline:none;"></div>`,
}, {
    id: "social",
    label: '<div class="panel__body sidebar__module  SidebarModule_sidebarModule__2aVdj " data-qa="sidebar-module"><div class="image-drag SidebarModule_imageDrag__z7ned"><i class="fa fa-dribbble" aria-hidden="true"></i></div><div class="body__title body__title--cs SidebarModule_sidebarModuleTitle__TnK1l"><span>Social</span></div></div>',
    content: `
    <div style="margin: 10px;">

<div name="00" class="p5_social" style="background-image: url(https://app.plumb5.com/p5-editor/website@2x-cir.png);height:35px;width:45px;background-size:contain;background-repeat:no-repeat;display: inline-block;">
      <a data-social="true" href="http://www.website.com" style="display: inline-block; width:40px; height:40px;padding:10px;" data-link-code></a>
   </div>

<div name="10" class="p5_social" style="background-image: url(https://app.plumb5.com/p5-editor/mail@2x-cir.png);height:35px;width:45px;background-size:contain;background-repeat:no-repeat;display: inline-block;">
      <a data-social="true" href="http://www.mail.com" style="display: inline-block; width:40px; height:40px;padding:10px;" data-link-code></a>
   </div>

<div name="11" class="p5_social" style="background-image: url(https://app.plumb5.com/p5-editor/facebook@2x-cir.png);height:35px;width:45px;background-size:contain;background-repeat:no-repeat;display: inline-block;">
      <a data-social="true" href="http://www.facebook.com" style="display: inline-block; width:40px; height:40px;padding:10px;" data-link-code></a>
   </div>

<div name="22" class="p5_social" style="background-image: url(https://app.plumb5.com/p5-editor/twitter@2x-cir.png);height:35px;width:45px;background-size:contain;background-repeat:no-repeat;display: inline-block;">
      <a data-social="true" href="http://www.twitter.com" style="display: inline-block; width:40px; height:40px;padding:10px;" data-link-code></a>
   </div>

<div name="33" class="p5_social" style="background-image: url(https://app.plumb5.com/p5-editor/instagram@2x-cir.png);height:35px;width:45px;background-size:contain;background-repeat:no-repeat;display: inline-block;">
      <a data-social="true" href="http://www.instagram.com" style="display: inline-block; width:40px; height:40px;padding:10px;" data-link-code></a>
   </div>
   
   <div name="44" class="p5_social" style="background-image: url(https://app.plumb5.com/p5-editor/linkedin@2x-cir.png);height:35px;width:45px;background-size:contain;background-repeat:no-repeat;display: inline-block;">
      <a data-social="true" href="http://www.linkedin.com" style="display: inline-block; width:40px; height:40px;padding:10px;" data-link-code></a>
   </div>
<div name="55" class="p5_social" style="background-image: url(https://app.plumb5.com/p5-editor/youtube@2x-cir.png);height:35px;width:45px;background-size:contain;background-repeat:no-repeat;display: inline-block;">
      <a data-social="true" href="http://www.youtube.com" style="display: inline-block; width:40px; height:40px;padding:10px;" data-link-code></a>
   </div>
<div name="66" class="p5_social" style="background-image: url(https://app.plumb5.com/p5-editor/whatsapp@2x-cir.png);height:35px;width:45px;background-size:contain;background-repeat:no-repeat;display: inline-block;">
      <a data-social="true" href="http://www.whatsapp.com" style="display: inline-block; width:40px; height:40px;padding:10px;" data-link-code></a>
   </div>
   <div name="77" class="p5_social" style="background-image: url(https://app.plumb5.com/p5-editor/pinterest@2x-cir.png);height:35px;width:45px;background-size:contain;background-repeat:no-repeat;display: inline-block;">
      <a data-social="true" href="https://pinterest.com/" style="display: inline-block; width:40px; height:40px;padding:10px;" data-link-code></a>
   </div>
</div>  
<style>
  .p5_social {
    height: 35px;
    width: 40px;
    background-size: contain;
    background-repeat: no-repeat;
    display: inline-block;
}
</style>`,
}, {
    id: "html-block",
    label: '<div class="panel__body sidebar__module  SidebarModule_sidebarModule__2aVdj " data-qa="sidebar-module"><div class="image-drag SidebarModule_imageDrag__z7ned"><i class="fa fa-code" aria-hidden="true"></i></div><div class="body__title body__title--cs SidebarModule_sidebarModuleTitle__TnK1l"><span>HTML code</span></div></div>',
    content: '<div name="html-code" data-html-code>Edit my HTML content</div>',
},];

const rows_list = [{
    id: "col1-1",
    label: '<div class="col-1"><div class="col-1-inner"></div></div>',
    content: `<div class="col-1-wrap" style="width:100%; overflow:hidden;">
    <div style="width:100%; min-height:30px;"></div> 
    </div>`,
}, {
    id: "col-2-col-2",
    label: '<div class="col-2"><div class="col-2-inner"></div><div class="col-2-inner margin-right-0"></div></div>',
    content: `<div class="col-2-wrap" style="width:100%; overflow:hidden;">
    <div style="width:50%; min-height:30px; float:left;"></div>
    <div style="width:50%; min-height:30px; float:left;"></div>
    </div>`,
}, {
    id: "col-9-col-3",
    label: '<div class="col-3-col-9"><div class="col-9-inner"></div><div class="col-3-inner margin-right-0"></div></div>',
    content: `<div class="col-3-col-9-wrap" style="width:100%;overflow:hidden;">
    <div style="width:75%; min-height:30px; float:left;"></div>
    <div style="width:25%; min-height:30px; float:left;"></div>
    </div>`,
}, {
    id: "col-3-col-9",
    label: '<div class="col-3-col-9"><div class="col-3-inner"></div><div class="col-9-inner margin-right-0"></div></div>',
    content: `<div class="col-3-col-9-wrap" style="width:100%; overflow:hidden;">
    <div style="width:25%; min-height:30px; float:left;"></div>
    <div style="width:75%; min-height:30px; float:left;"></div>
    </div>`,
}, {
    id: "col-8-col-4",
    label: '<div class="col-4-col-8"><div class="col-8-inner"></div><div class="col-4-inner margin-right-0"></div></div>',
    content: `<div class="col-4-col-8-wrap" style="width:100%; overflow:hidden;">
    <div style="width:66.6666667%; min-height:30px; float:left;"></div>
    <div style="width:33.333333%; min-height:30px; float:left;"></div>
    </div>`,
}, {
    id: "col-4-col-8",
    label: '<div class="col-4-col-8"><div class="col-4-inner"></div><div class="col-8-inner margin-right-0"></div></div>',
    content: `<div class="col-4-col-8-wrap" style="width:100%; overflow:hidden;">
    <div style="width:33.333333%; min-height:30px; float:left;"></div>
    <div style="width:66.666666%; min-height:30px; float:left;"></div>
    </div>`,
}, {
    id: "col-3-col-3-col-3",
    label: '<div class="col-3-col-3-col"><div class="col-3-inner"></div><div class="col-3-inner"></div><div class="col-3-inner margin-right-0"></div></div>',
    content: `<div class="col-3-col-3-wrap" style="width:100%; overflow:hidden;">
    <div style="width:33.333333%; min-height:30px; float:left;"></div>
    <div style="width:33.333333%; min-height:30px; float:left;"></div>
    <div style="width:33.333333%; min-height:30px; float:left;"></div>
    </div>`,
}, {
    id: "col-2-col-2-col-6",
    label: '<div class="col-2-col-2-col-6"><div class="col-2-inner"></div><div class="col-2-inner"></div><div class="col-6-inner margin-right-0"></div></div>',
    content: `<div class="col-2-col-2-col-6-wrap" style="width:100%; overflow:hidden;">
    <div style="width:25%; min-height:30px; float:left;"></div>
    <div style="width:25%; min-height:30px; float:left;"></div>
    <div style="width:50%; min-height:30px; float:left;"></div>
    </div>`,
}, {
    id: "col-2-col-6-col-2",
    label: '<div class="col-2-col-2-col-6"><div class="col-2-inner"></div><div class="col-6-inner"></div><div class="col-2-inner margin-right-0"></div></div>',
    content: `<div class="col-2-col-6-col-2-wrap" style="width:100%; overflow:hidden;">
    <div style="width:25%; min-height:30px; float:left;"></div>
    <div style="width:50%; min-height:30px; float:left;"></div>
    <div style="width:25%; min-height:30px; float:left;"></div>
    </div>`,
}, {
    id: "col-6-col-2-col-2",
    label: '<div class="col-2-col-2-col-6"><div class="col-6-inner"></div><div class="col-2-inner"></div><div class="col-2-inner margin-right-0"></div></div>',
    content: `<div class="col-6-col-2-col-2-wrap" style="width:100%; overflow:hidden;">
    <div style="width:50%; min-height:30px; float:left;"></div>
    <div style="width:25%; min-height:30px; float:left;"></div>
    <div style="width:25%; min-height:30px; float:left;"></div>
    </div>`,
}, {
    id: "col-3-col-3-col-3-col-3",
    label: '<div class="col-4-col-4"><div class="col-2-inner"></div><div class="col-2-inner"></div><div class="col-2-inner"></div><div class="col-2-inner margin-right-0"></div></div>',
    content: `<div class="col-4-wrap" style="width:100%; overflow:hidden;">
    <div style="width:25%; min-height:30px; float:left;"></div>
    <div style="width:25%; min-height:30px; float:left;"></div>
    <div style="width:25%; min-height:30px; float:left;"></div>
    <div style="width:25%;  min-height:30px; float:left;"></div>
    </div>`,
},];

const myNewComponentTypes = (editor) => {
    editor.DomComponents.addType("menu-item", {
        isComponent: (el) => el.name === "menu-item",

        model: {
            defaults: {
                draggable: "ul",
                droppable: false,
                traits: ["name", "href", "content"],
            },
        },
    });

    editor.DomComponents.addType("image", {
        isComponent: (el) => el.name === "image",

        model: {
            defaults: {
                droppable: false,
                draggable: true,
                traits: ["name", "href"],
            },
        },
    });

    var defaultType = editor.DomComponents.getType("default");
    var _initToolbar = defaultType.model.prototype.initToolbar;
    editor.DomComponents.addType("html-code", {
        model: defaultType.model.extend({
            initToolbar(args) {
                _initToolbar.apply(this, args);

                var toolbar = this.get("toolbar");
                toolbar.push({
                    attributes: {
                        class: "fa fa-code",
                    },
                    command: "open-html-code-editor",
                });
                this.set("toolbar", toolbar);
            },
        }, {
            isComponent: (el) => {
                if (typeof el.hasAttribute == "function" && el.hasAttribute("data-html-code")) {
                    return {
                        type: "html-code",
                    };
                }
            }
            ,
        }),
        view: defaultType.view,
    });

    //new changes
    editor.DomComponents.addType("Link", {

        model: defaultType.model.extend({
            initToolbar(args) {
                _initToolbar.apply(this, args);

                var toolbar = this.get("toolbar");
                const tbExists = toolbar.some(item => item.command === "open-link-editor");

                if (this.getAttributes()["data-social"] == 'true') {
                    delete toolbar[2];
                }

                if (!tbExists) {
                    toolbar.push({
                        attributes: {
                            class: "fa fa-code",
                        },
                        command: "open-link-editor",
                    });
                }
                this.set("toolbar", toolbar);
            },
        }, {
            isComponent: (el) => {
                if (typeof el.hasAttribute == "function" && el.hasAttribute("data-link-code")) {
                    return {
                        type: "Link",
                    };
                }
            }
            ,
        }),
        view: defaultType.view,

    });

}
    ;

const editor = grapesjs.init({
    container: "#gjs",
    height: "680px",
    width: "auto",
    storageManager: false,
    colorPicker: {
        appendTo: 'parent',
        offset: {
            top: 26,
            left: -166,
        },
    },
    plugins: [myNewComponentTypes, "grapesjs-plugin-export"],

    assetManager: {
        storageType: '',
        storeOnChange: true,
        storeAfterUpload: true,
        upload: '/Mail/DesignTemplateWithP5Editor/',
        //for temporary storage
        assets: [],
        uploadFile: function (e) {
            var files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
            var formData = new FormData();
            for (var i in files) {
                formData.append('file-' + i, files[i])
                //containing all the selected images from local
            }
            $.ajax({
                url: '/Mail/DesignTemplateWithP5Editor/SaveImage',
                type: 'POST',
                data: formData,
                contentType: false,
                crossDomain: true,
                dataType: 'json',
                mimeType: "multipart/form-data",
                processData: false,
                success: function (result) {
                    $.each(result, function () {
                        editor.AssetManager.add({
                            src: this.ImageUrl,
                            height: this.Height,
                            width: this.Width,
                            name: this.Name
                        });
                    })
                }
            });
        },
    },

    blockManager: {
        appendTo: ".blocks-container",
        blocks: block_list,
    },
    layerManager: {
        appendTo: ".layers-container",
    },
    deviceManager: {
        devices: [{
            name: "Desktop",
            width: "",
        }, {
            name: "Mobile",
            width: "320px",
            widthMedia: "480px",
        },],
    },

    panels: {
        defaults: [{
            id: "layers",
            el: ".panel__right",

            resizable: {
                maxDim: 350,
                minDim: 200,
                tc: 0,
                cl: 1,
                cr: 0,
                bc: 0,
                keyWidth: "flex-basis",
            },
        }, {
            id: "panel-devices",
            el: ".panel__devices",
            buttons: [{
                id: "undo-btn",
                label: '<div class="devicewrap"><i class="fa fa-undo"></i></div>',
                command: "gjs-undo-content",
                togglable: false,
            }, {
                id: "device-desktop",
                label: '<div class="devicewrap"><i class="fa fa-desktop"></i></div>',
                command: "set-device-desktop",
                active: true,
                togglable: false,
            }, {
                id: "device-mobile",
                label: '<div class="devicewrap"><i class="fa fa-mobile"></i></div>',
                command: "set-device-mobile",
                togglable: true,
            }, {
                id: "save-btn",
                label: '<div class="btn btn-primary btn-sm" >SAVE</div>',
                command: "gjs-save-data",
                togglable: false,
            },],
        }, {
            id: "panel-switcher",
            el: ".panel__switcher",
            buttons: [
                {
                    id: "show-block",
                    active: true,
                    label: '<i class="fa fa-cubes" title="Blocks"  id="btnBlocks"></i> <br> Blocks',
                    command: "show-blocks",
                    togglable: false,
                }, {
                    id: "show-style",
                    active: true,
                    label: '<i class="fa fa-paint-brush" title="Styles" id="btnStyles"></i> <br> Styles',
                    command: "show-styles",
                    togglable: false,
                }, {
                    id: "show-rows",
                    active: true,
                    label: '<i class="fa fa-th-large" title="Rows"></i> <br> Rows',
                    command: "show-rows",
                    togglable: false,
                }, //{
                //    id: "component-mgmt",
                //    active: true,
                //    label: '<i class="fa fa-link" title="Traits" id="btnTraits"></i> <br> Traits',
                //    command: "show-traits",
                //    togglable: false,
                //},
                //{
                //    id: "show-layers",
                //    active: true,
                //    label: '<i class="fa fa-database" title="Layers"></i> <br> Layers',
                //    command: "show-layers",

                //    togglable: false,
                //},
            ],
        },],
    },

    // commands: {
    //     'export-template': {
    //         run: function(editor, sender) {
    //             // Get the HTML and CSS code from the editor
    //             var html = editor.getHtml();
    //             var css = editor.getCss();

    //             // Create a new zip archive
    //             var zip = new JSZip();

    //             // Add the HTML and CSS files to the archive
    //             zip.file("index.html", html);
    //             zip.file("style.css", css);

    //             // Generate the zip file and download it
    //             zip.generateAsync({ type: "blob" }).then(function(content) {
    //                 saveAs(content, "template.zip");
    //             });
    //         }
    //     }
    // },

    traitManager: {
        appendTo: ".traits-container",
    },

    selectorManager: {
        appendTo: ".styles-container",
    },

    styleManager: {
        appendTo: ".styles-container",
        sectors: [{
            open: false,
            buildProps: ["width", "max-width", "min-height", "text-decoration", "font", "font-size", "color", "font-weight", "line-height", "text-align", "padding", "margin", "background-color", "border", "border-radius", "border-color",],
            properties: [{
                id: "font-size",
                name: "Font Size",
                property: "font-size",
                type: "slider",
                default: 20,
                min: 1,
                max: 50,
            }, {
                id: "text-decoration",
                name: "Text Decoration",
                property: "text-decoration",
                type: "select",
                options: [{
                    value: "",
                    name: "Default style"
                }, {
                    value: "none",
                    name: "No underline"
                }, {
                    value: "line-through",
                    name: "Strikethrough"
                }, {
                    value: "underline",
                    name: "Underline"
                },],
            }, {
                id: "font",
                name: "Font",
                property: "font-family",
                type: "select",
                defaults: "sans-serif",

                options: [{
                    value: "Cambria",
                }, {
                    value: "Arial",
                }, {
                    value: "Arial Black",
                }, {
                    value: "Comic Sans MS",
                }, {
                    value: "serif",
                }, {
                    value: "Georgia",
                }, {
                    value: "Helvetica",
                }, {
                    value: "Courier New",
                }, {
                    value: "Impact",
                }, {
                    value: "Raleway",
                }, {
                    value: "Source Sans Pro",
                }, {
                    value: "Times New Roman",
                }, {
                    value: "Trebuchet MS",
                }, {
                    value: "Tahoma",
                }, {
                    value: "Verdana",
                }, {
                    value: "sans-serif",
                },],
            }, {
                name: "border-top",
                property: "border-top",
                type: "composite",
                properties: [{
                    name: "Width",
                    property: "border-top-width",
                    type: "slider",
                    defaults: "0",
                    step: 1,
                    units: ["px", "%", "em"],
                }, {
                    name: "Style",
                    property: "border-top-style",
                    type: "select",
                    defaults: "solid",
                    options: [{
                        value: "none",
                        name: "None"
                    }, {
                        value: "solid",
                        name: "Solid"
                    }, {
                        value: "dashed",
                        name: "Dashed"
                    }, {
                        value: "dotted",
                        name: "Dotted"
                    }, {
                        value: "double",
                        name: "Double"
                    }, {
                        value: "groove",
                        name: "Groove"
                    }, {
                        value: "ridge",
                        name: "Ridge"
                    }, {
                        value: "inset",
                        name: "Inset"
                    }, {
                        value: "outset",
                        name: "Outset"
                    },],
                }, {
                    name: "Color",
                    property: "border-top-color",
                    type: "color",
                    defaults: "#000",
                },],
            }, {
                name: "border-bottom",
                property: "border-bottom",
                type: "composite",
                properties: [{
                    name: "Width",
                    property: "border-bottom-width",
                    type: "slider",
                    defaults: "0",
                    step: 1,
                    units: ["px", "%", "em"],
                }, {
                    name: "Style",
                    property: "border-bottom-style",
                    type: "select",
                    defaults: "solid",
                    options: [{
                        value: "none",
                        name: "None"
                    }, {
                        value: "solid",
                        name: "Solid"
                    }, {
                        value: "dashed",
                        name: "Dashed"
                    }, {
                        value: "dotted",
                        name: "Dotted"
                    }, {
                        value: "double",
                        name: "Double"
                    }, {
                        value: "groove",
                        name: "Groove"
                    }, {
                        value: "ridge",
                        name: "Ridge"
                    }, {
                        value: "inset",
                        name: "Inset"
                    }, {
                        value: "outset",
                        name: "Outset"
                    },],
                }, {
                    name: "Color",
                    property: "border-bottom-color",
                    type: "color",
                    defaults: "#000",
                },],
            }, {
                name: "border-left",
                property: "border-left",
                type: "composite",
                properties: [{
                    name: "Width",
                    property: "border-left-width",
                    type: "slider",
                    defaults: "0",
                    step: 1,
                    units: ["px", "%", "em"],
                }, {
                    name: "Style",
                    property: "border-left-style",
                    type: "select",
                    defaults: "solid",
                    options: [{
                        value: "none",
                        name: "None"
                    }, {
                        value: "solid",
                        name: "Solid"
                    }, {
                        value: "dashed",
                        name: "Dashed"
                    }, {
                        value: "dotted",
                        name: "Dotted"
                    }, {
                        value: "double",
                        name: "Double"
                    }, {
                        value: "groove",
                        name: "Groove"
                    }, {
                        value: "ridge",
                        name: "Ridge"
                    }, {
                        value: "inset",
                        name: "Inset"
                    }, {
                        value: "outset",
                        name: "Outset"
                    },],
                }, {
                    name: "Color",
                    property: "border-left-color",
                    type: "color",
                    defaults: "#000",
                },],
            }, {
                name: "border-right",
                property: "border-right",
                type: "composite",
                properties: [{
                    name: "Width",
                    property: "border-right-width",
                    type: "slider",
                    defaults: "0",
                    step: 1,
                    units: ["px", "%", "em"],
                }, {
                    name: "Style",
                    property: "border-right-style",
                    type: "select",
                    defaults: "solid",
                    options: [{
                        value: "none",
                        name: "None"
                    }, {
                        value: "solid",
                        name: "Solid"
                    }, {
                        value: "dashed",
                        name: "Dashed"
                    }, {
                        value: "dotted",
                        name: "Dotted"
                    }, {
                        value: "double",
                        name: "Double"
                    }, {
                        value: "groove",
                        name: "Groove"
                    }, {
                        value: "ridge",
                        name: "Ridge"
                    }, {
                        value: "inset",
                        name: "Inset"
                    }, {
                        value: "outset",
                        name: "Outset"
                    },],
                }, {
                    name: "Color",
                    property: "border-right-color",
                    type: "color",
                    defaults: "#000",
                },],
            }, {
                id: "text-align",
                name: "Text align",
                property: "text-align",
                defaults: "left",

                options: [{
                    value: "left",
                    name: "Left",
                    className: "fa fa-align-left",
                }, {
                    value: "center",
                    name: "Center",
                    className: "fa fa-align-center",
                }, {
                    value: "right",
                    name: "Right",
                    className: "fa fa-align-right",
                }, {
                    value: "justify",
                    name: "Justify",
                    className: "fa fa-align-justify",
                },],
            },],
        }, //{
        //    name: "General",
        //    open: 1,
        //    buildProps: ["float", "top", "right", "left", "bottom"]
        //},
        {
            name: "Typography",
            open: !1,
            buildProps: ["text-decoration", "font", "font-size", "color", "font-weight", "line-height", "text-transform", "letter-spacing", "text-align",],
            properties: [//{
                //    id: "font-size",
                //    name: "Font Size",
                //    property: "font-size",
                //    type: "slider",
                //    default: 20,
                //    min: 1,
                //    max: 50,
                //},
                {
                    id: "text-transform",
                    name: "Text transform",
                    property: "text-transform",
                    type: "select",
                    options: [
                        { value: "", name: "Default style" },
                        { value: "uppercase", name: "Uppercase" },
                        { value: "lowercase", name: "Lowercase" },
                        { value: "capitalize", name: "Capitalize" },
                        { value: "initial", name: "Initial" },
                        { value: "inherit", name: "Inherit" },
                    ],
                },
                {
                    id: "text-decoration",
                    name: "Text Decoration",
                    property: "text-decoration",
                    type: "select",
                    options: [{
                        value: "",
                        name: "Default style"
                    }, {
                        value: "none",
                        name: "No underline"
                    }, {
                        value: "line-through",
                        name: "Strikethrough"
                    }, {
                        value: "underline",
                        name: "Underline"
                    },],
                }, {
                    id: "font",
                    name: "Font",
                    property: "font-family",
                    type: "select",
                    defaults: "sans-serif",

                    options: [{
                        value: "Cambria",
                    }, {
                        value: "Arial",
                    }, {
                        value: "Arial Black",
                    }, {
                        value: "Comic Sans MS",
                    }, {
                        value: "serif",
                    }, {
                        value: "Georgia",
                    }, {
                        value: "Helvetica",
                    }, {
                        value: "Courier New",
                    }, {
                        value: "Impact",
                    }, {
                        value: "Raleway",
                    }, {
                        value: "Source Sans Pro",
                    }, {
                        value: "Times New Roman",
                    }, {
                        value: "Trebuchet MS",
                    }, {
                        value: "Tahoma",
                    }, {
                        value: "Verdana",
                    }, {
                        value: "sans-serif",
                    },],
                }],
        }, {
            name: "Dimension",
            open: !1,
            buildProps: ["width", "height", "max-width", "min-height", "margin", "padding"],
            properties: [{
                type: 'number',
                property: 'width',
                default: '0',
                units: ['%', 'px'],
                min: 0
            }, {
                type: 'number',
                property: 'max-width',
                default: '0',
                units: ['%', 'px'],
                min: 0
            },
            ]
        }, {
            name: "Decoration",
            open: !1,
            buildProps: ["border", "border-radius", "border-color", "background-color",],
            properties: [{
                name: "border-top",
                property: "border-top",
                type: "composite",
                properties: [{
                    name: "Width",
                    property: "border-top-width",
                    type: "slider",
                    defaults: "0",
                    step: 1,
                    units: ["px", "%", "em"],
                }, {
                    name: "Style",
                    property: "border-top-style",
                    type: "select",
                    defaults: "solid",
                    options: [{
                        value: "none",
                        name: "None"
                    }, {
                        value: "solid",
                        name: "Solid"
                    }, {
                        value: "dashed",
                        name: "Dashed"
                    }, {
                        value: "dotted",
                        name: "Dotted"
                    }, {
                        value: "double",
                        name: "Double"
                    }, {
                        value: "groove",
                        name: "Groove"
                    }, {
                        value: "ridge",
                        name: "Ridge"
                    }, {
                        value: "inset",
                        name: "Inset"
                    }, {
                        value: "outset",
                        name: "Outset"
                    },],
                }, {
                    name: "Color",
                    property: "border-top-color",
                    type: "color",
                    defaults: "#000",
                },],
            }, {
                name: "border-bottom",
                property: "border-bottom",
                type: "composite",
                properties: [{
                    name: "Width",
                    property: "border-bottom-width",
                    type: "slider",
                    defaults: "0",
                    step: 1,
                    units: ["px", "%", "em"],
                }, {
                    name: "Style",
                    property: "border-bottom-style",
                    type: "select",
                    defaults: "solid",
                    options: [{
                        value: "none",
                        name: "None"
                    }, {
                        value: "solid",
                        name: "Solid"
                    }, {
                        value: "dashed",
                        name: "Dashed"
                    }, {
                        value: "dotted",
                        name: "Dotted"
                    }, {
                        value: "double",
                        name: "Double"
                    }, {
                        value: "groove",
                        name: "Groove"
                    }, {
                        value: "ridge",
                        name: "Ridge"
                    }, {
                        value: "inset",
                        name: "Inset"
                    }, {
                        value: "outset",
                        name: "Outset"
                    },],
                }, {
                    name: "Color",
                    property: "border-bottom-color",
                    type: "color",
                    defaults: "#000",
                },],
            }, {
                name: "border-left",
                property: "border-left",
                type: "composite",
                properties: [{
                    name: "Width",
                    property: "border-left-width",
                    type: "slider",
                    defaults: "0",
                    step: 1,
                    units: ["px", "%", "em"],
                }, {
                    name: "Style",
                    property: "border-left-style",
                    type: "select",
                    defaults: "solid",
                    options: [{
                        value: "none",
                        name: "None"
                    }, {
                        value: "solid",
                        name: "Solid"
                    }, {
                        value: "dashed",
                        name: "Dashed"
                    }, {
                        value: "dotted",
                        name: "Dotted"
                    }, {
                        value: "double",
                        name: "Double"
                    }, {
                        value: "groove",
                        name: "Groove"
                    }, {
                        value: "ridge",
                        name: "Ridge"
                    }, {
                        value: "inset",
                        name: "Inset"
                    }, {
                        value: "outset",
                        name: "Outset"
                    },],
                }, {
                    name: "Color",
                    property: "border-left-color",
                    type: "color",
                    defaults: "#000",
                },],
            }, {
                name: "border-right",
                property: "border-right",
                type: "composite",
                properties: [{
                    name: "Width",
                    property: "border-right-width",
                    type: "slider",
                    defaults: "0",
                    step: 1,
                    units: ["px", "%", "em"],
                }, {
                    name: "Style",
                    property: "border-right-style",
                    type: "select",
                    defaults: "solid",
                    options: [{
                        value: "none",
                        name: "None"
                    }, {
                        value: "solid",
                        name: "Solid"
                    }, {
                        value: "dashed",
                        name: "Dashed"
                    }, {
                        value: "dotted",
                        name: "Dotted"
                    }, {
                        value: "double",
                        name: "Double"
                    }, {
                        value: "groove",
                        name: "Groove"
                    }, {
                        value: "ridge",
                        name: "Ridge"
                    }, {
                        value: "inset",
                        name: "Inset"
                    }, {
                        value: "outset",
                        name: "Outset"
                    },],
                }, {
                    name: "Color",
                    property: "border-right-color",
                    type: "color",
                    defaults: "#000",
                },]
            },
            ]

        },
        ],
    },

    // storageManager: {
    //     type: 'local',
    //     options: {
    //         local: { key: `gjsProject` }
    //     }
    // },
});

editor.BlockManager.add("btn", {
    label: "Button",
    content: block_list[0].content,
    render: ({ el }) => {
        const uniqueId = "btn-" + new Date().getTime();
        const uniqueClass = "my-button-class-" + uniqueId;
        el.querySelector(".my-button-class").classList.add(uniqueClass);
        el.addEventListener("click", () => {
            alert("Button clicked!");
        }
        );
    }
    ,
});

editor.RichTextEditor.add("Bullet List", {
    icon: '<i class="fa fa-list-ul" aria-hidden="true"></i>',
    attributes: {
        title: "Unordered List",
    },
    result: (rte) => rte.exec("insertUnorderedList"),
});
editor.RichTextEditor.add("Number List", {
    icon: '<i class=" fa fa-list-ol" aria-hidden="true"></i>',
    attributes: {
        title: "Unordered List",
    },
    result: (rte) => rte.exec("insertOrderedList"),
});

editor.RichTextEditor.add('fontSize', {
    icon: `<select class="gjs-field">
            <option>Size</option>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
            <option>6</option>
            <option>7</option>           
      </select>`,
    event: 'change',
    result: (rte, action) => rte.exec('fontSize', action.btn.firstChild.value)
});
editor.RichTextEditor.add('forecolor', {
    icon: `<select class="gjs-field">
        <option>ForeColor</option>
        <option>White</option>
        <option>Black</option>
        <option>Brown</option>
        <option>Beige</option>
        <option>DarkBlue</option>
        <option>Blue</option>
        <option>LightBlue</option>
        <option>DarkRed</option>
        <option>Red</option>
        <option>DarkGreen</option>
        <option>Green</option>
        <option>Purple</option>
        <option>DarkTurquois</option>
        <option>Turquois</option>
        <option>DarkOrange</option>
        <option>Orange</option>
        <option>Yellow</option>
      </select>`,
    event: 'change',
    result: (rte, action) => rte.exec('forecolor', action.btn.firstChild.value),
});

editor.RichTextEditor.add('backcolor', {
    icon: `<select id="forecolor" class="gjs-field">
       <option>BackColor</option>
        <option>White</option>
        <option>Black</option>
        <option>Brown</option>
        <option>Beige</option>
        <option>DarkBlue</option>
        <option>Blue</option>
        <option>LightBlue</option>
        <option>DarkRed</option>
        <option>Red</option>
        <option>DarkGreen</option>
        <option>Green</option>
        <option>Purple</option>
        <option>DarkTurquois</option>
        <option>Turquois</option>
        <option>DarkOrange</option>
        <option>Orange</option>
        <option>Yellow</option>
      </select>`,
    event: 'change',
    result: (rte, action) => rte.exec('backColor', action.btn.firstChild.value),
});

//new changes
var SelectedNodeText = "";
var Selected_rte;
var Selected_nextSibling;
editor.RichTextEditor.remove('link');
editor.RichTextEditor.add('link', {
    icon: '<i class="fa fa-link" aria-hidden="true"></i>',
    attributes: {
        title: 'Link'
    },
    result: rte => {

        SelectedNodeText = rte.selection().toString();
        var id = 0;
        if ((rte.selection().focusNode.parentElement.tagName != undefined) && rte.selection().focusNode.parentElement.tagName.toLowerCase() == 'a') {
            id = rte.selection().focusNode.parentElement.getAttribute("id");
        } else {
            id = Math.random().toString().replace('.', '');
            rte.insertHTML(`<a id="${id}"  data-gjs-type="link" draggable="true" href="" class="">${SelectedNodeText}</a>`);
        }
        event.preventDefault();//id="${id}"

        if (SelectedNodeText != "") {

            var prehref = rte.selection().focusNode.parentElement.getAttribute("href") != null ? rte.selection().focusNode.parentElement.getAttribute("href") : "";
            var pretarget = rte.selection().focusNode.parentElement.getAttribute("target");

            var preoption1 = "", preoption2 = "", preoption3 = "";
            if (prehref.toString().indexOf("mailto:") > -1) {
                preoption2 = "checked";
            }
            if (prehref.toString().indexOf("tel:") > -1) {
                preoption3 = "checked";
            }
            else
                preoption1 = "checked";

            const dialog = editor.Modal;
            const modalContent = `
        <div class="dialog">
            <div class="div-container" style="word-spacing: 30px;">
                <input style="margin-right: 5px;" type="radio" name="fav_link" id="rdoLink" value="link" onclick="javascript:document.getElementById('dvTarget').style.display = 'block';document.getElementById('lblLink').innerHTML='Href:';" ${preoption1}>Link
                <input style="margin-right: 5px;" type="radio" name="fav_link" id="rdoEmail" value="mailto" onclick="javascript:document.getElementById('dvTarget').style.display = 'none';document.getElementById('lblLink').innerHTML='MailTo:';" ${preoption2}>MailTo
                <input style="margin-right: 5px;" type="radio" name="fav_link" id="rdoPhone" value="phoneto" onclick="javascript:document.getElementById('dvTarget').style.display = 'none';document.getElementById('lblLink').innerHTML='Phonenumber:';" ${preoption3}>Telephone
            </div>

          <label id="lblLink"  for="txtLink">Href:</label>
          <input class="dialog-input" type="text" id="txtLink" value="${prehref.replace("mailto:", "").replace("tel:", "")}">


            <div class="gjs-field gjs-field-select"   style="width: 25%;margin-top: 10px;" id="dvTarget">
            <label  for="txtLink">Target:</label><br/>
            <select id="ddlTarget" style="appearance: auto;"><option value="false">This window</option><option value="_blank" select>New window</option></select>
            </div>


          <div class="div-container">
            <button id="submit" class="gjs-btn-prim">Submit</button>
            <span style="margin-left: 10px;color:red" id="lnkErrorMsg"></span>
          </div>
           <div class="div-container">
            <span style="font-size: 12px;color:red">Click the icon(<span style="color:black"><i class="fa fa-chain-broken" aria-hidden="true"></i></span>) from the toolbar to remove the previous linking.</span>
          </div>
        </div>

      `;


            dialog.setTitle("Insert Link").setContent(modalContent);
            dialog.open();

            if (prehref.toString().indexOf("mailto:") > -1) {
                document.getElementById('dvTarget').style.display = 'none';
                document.getElementById('lblLink').innerHTML = 'MailTo:';
            }
            if (prehref.toString().indexOf("tel:") > -1) {
                document.getElementById('dvTarget').style.display = 'none';
                document.getElementById('lblLink').innerHTML = 'Phonenumber:';
            }

            if (pretarget != null) {
                document.getElementById("ddlTarget").selectedIndex = "1"
            }
            const submitBtn = dialog.getContentEl().querySelector("#submit");
            const LinkInput = dialog.getContentEl().querySelector("#txtLink");

            submitBtn.addEventListener("click", (rte) => {
                const getLinkInput = LinkInput.value;

                if (getLinkInput) {
                    var ele = document.getElementsByClassName('gjs-frame')[0].contentWindow.document.getElementById(id);
                    if (document.getElementById("rdoLink").checked == true) {

                        var e = document.getElementById("ddlTarget");
                        var value = e.options[e.selectedIndex].value;

                        ele.setAttribute("href", getLinkInput);

                        if (href_Arr.length > 0 && href_Arr.find(f => f.id == id) != undefined)
                            href_Arr.find(f => f.id = id)['href'] = getLinkInput;
                        else
                            href_Arr.push({ "id": id, "href": getLinkInput });


                        if (value == '_blank') {
                            ele.setAttribute("target", '_blank');
                        }
                    }
                    if (document.getElementById("rdoEmail").checked == true) {
                        ele.setAttribute("href", "mailto:" + getLinkInput + "");
                        if (href_Arr.length > 0 && href_Arr.find(f => f.id == id) != undefined)
                            href_Arr.find(f => f.id = id)['href'] = "mailto:" + getLinkInput;
                        else
                            href_Arr.push({ "id": id, "href": "mailto:" + getLinkInput });
                    }
                    if (document.getElementById("rdoPhone").checked == true) {
                        ele.setAttribute("href", "tel:" + getLinkInput + "");
                        if (href_Arr.length > 0 && href_Arr.find(f => f.id == id) != undefined)
                            href_Arr.find(f => f.id = id)['href'] = "tel:" + getLinkInput;
                        else
                            href_Arr.push({ "id": id, "href": "tel:" + getLinkInput });
                    }

                    dialog.close();

                }


            });

        }
    }

});
editor.RichTextEditor.add('remove-link', {
    icon: '<i class="fa fa-chain-broken" aria-hidden="true"></i>',
    attributes: {
        title: 'Remove Link'
    },
    result: rte => {

        rte.exec('unlink');

        const dialog = editor.Modal;
        const modalContent = `
        <div class="dialog">
          <label id="lblLink"  for="txtLink">Sucessfully removed the link</label>
          <div class="div-container">
            <button id="submit" class="gjs-btn-prim">OK</button> 
          </div>           
        </div>        
      `;

        dialog.setTitle("Remove Link").setContent(modalContent);
        dialog.open();

        const submitBtn = dialog.getContentEl().querySelector("#submit");
        const LinkInput = dialog.getContentEl().querySelector("#txtLink");

        submitBtn.addEventListener("click", (rte) => {
            dialog.close();
        }
        );
    }
});

//Merge Tags
function GrapesMergeTags(ContactMergeTagList) {
    editor.RichTextEditor.add('Merge Tags', {
        icon: '<i class="fa fa-user" aria-hidden="true"></i>',
        attributes: {
            title: 'Merge Tags'
        },
        result: rte => {

            Selected_rte = rte;
            SelectedText = rte.selection().toString();
            rte.insertHTML('[{*p5tag*}]');

            const dialog = editor.Modal;
            const modalContent = `
        <div class="dialog">
           <div class="div-container">
                <input style="margin-right: 5px;" type="radio" name="fav_link" id="rdoUser" value="link" onclick="javascript:document.getElementById('dvUser').style.display = 'block';document.getElementById('dvCustom').style.display = 'none';" checked>User Attribute
                <input style="margin-right: 5px;margin-left: 20px;" type="radio" name="fav_link" id="rdoEvent" value="mailto" onclick="javascript:document.getElementById('dvUser').style.display = 'none';document.getElementById('dvCustom').style.display = 'block';">Custom Events
            </div>
            <div class="gjs-field gjs-field-select" style="width: 35%;margin-top: 10px;" id="dvUser">
            <label>Attribute:</label><br/>
            <select id="ddlUserTag" style="appearance: auto;"><option value="Select">Select</option>${ddlContactFields}</select>
            </div>
            <div class="gjs-field gjs-field-select" style="margin-top: 10px;display:none" id="dvCustom">
            <label>Attribute:</label><br/>
            <select id="ddlCustomTag1" style="width: 25%;appearance: auto;"><option value="Select">Select</option>${ddlContacteventFields}</select>
            <select id="ddlCustomTag2" style="width: 25%;appearance: auto;"><option value="Product">Product</option><option value="_blank" value="Price">Price</option></select>
            </div>
          <div class="div-container">
            <button id="submit" class="gjs-btn-prim">Save</button> 
          </div>           
        </div>        
      `;

            dialog.setTitle("Merge Tags").setContent(modalContent);
            dialog.open();

            const submitBtn = dialog.getContentEl().querySelector("#submit");
            const LinkInput = dialog.getContentEl().querySelector("#txtLink");

            submitBtn.addEventListener("click", (rte) => {
                //submitBtn.OnClientClick = function () {
                var eventHtyml = "";
                if (document.getElementById("rdoUser").checked == true) {
                    var e = document.getElementById("ddlUserTag");
                    var UserTagvalue = e.options[e.selectedIndex].value;
                    eventHtyml = "[{*" + UserTagvalue + "*}]";
                } else {
                    var e = document.getElementById("ddlCustomTag1");
                    var CustomTag1value1 = e.options[e.selectedIndex].value;

                    var e = document.getElementById("ddlCustomTag2");
                    var CustomTag1value2 = e.options[e.selectedIndex].value;

                    eventHtyml = "{{*[" + CustomTag1value1 + "]~[" + CustomTag1value2 + "]~[TOP1.DESC]~[fallbackdata]*}}";
                }

                var tagid = editor.getSelected().ccid;
                if (eventHtyml != "") {
                    var datatext = document.getElementsByClassName('gjs-frame')[0].contentWindow.document.getElementById(tagid).innerHTML.toString();
                    var newdata = datatext.replace("[{*p5tag*}]", eventHtyml);
                    document.getElementsByClassName('gjs-frame')[0].contentWindow.document.getElementById(tagid).innerHTML = newdata;
                    //Selected_rte.insertHTML(eventHtyml);

                    if (tag_Arr.length > 0 && tag_Arr.find(f => f.id == tagid) != undefined)
                        tag_Arr.find(f => f.id = tagid)['tag'] = eventHtyml;
                    else
                        tag_Arr.push({ "id": tagid, "tag": eventHtyml });
                }
                dialog.close();
            }
            );

            document.getElementsByClassName("gjs-mdl-btn-close")[0].addEventListener("click", myCloseFunction);

            function myCloseFunction() {
                var tagid = editor.getSelected().ccid;
                var datatext = document.getElementsByClassName('gjs-frame')[0].contentWindow.document.getElementById(tagid).innerHTML.toString();
                var newdata = datatext.replace("[{*p5tag*}]", SelectedText);
                document.getElementsByClassName('gjs-frame')[0].contentWindow.document.getElementById(tagid).innerHTML = newdata;
            }

            $('.gjs-mdl-container').on('click', function (e) {
                if ($('.gjs-mdl-container').css('display') == 'none') {
                    myCloseFunction();
                }
            });
        }
    });
}

//new changes
editor.Commands.add("open-link-editor", {
    run: function (editor, sender, data) {
        //document.getElementsByClassName("fa fa-code gjs-toolbar-item")[0].remove();

        var component = editor.getSelected();
        var modalContent = document.createElement("div");
        modalContent.setAttribute("class", "dialog gjs-field gjs-field-select");

        var label = document.createElement("label");
        label.innerHTML = "Href: "
        label.style = "margin-top: 10px;";

        var editorInput = document.createElement("input");
        editorInput.setAttribute("type", "text");
        editorInput.setAttribute("id", "textHref");
        editorInput.setAttribute("class", "dialog-input");

        editorInput.value = component.getAttributes().href != undefined ? component.getAttributes().href.replace("mailto:", "").replace("tel:", "") : "";

        var label_title = document.createElement("label");
        label_title.innerHTML = "Title: "
        label_title.style = "margin-top: 10px;";

        var editorInput_title = document.createElement("input");
        editorInput_title.setAttribute("type", "text");
        editorInput_title.setAttribute("id", "textTitle");
        editorInput_title.setAttribute("class", "dialog-input");
        editorInput_title.style = "width: 50%;";

        editorInput_title.value = component.getAttributes().title != undefined ? component.getAttributes().title : "";

        var label2 = document.createElement("label");
        label2.innerHTML = "Text: "

        var editorInput1 = document.createElement("input");
        editorInput1.setAttribute("type", "text");
        editorInput1.setAttribute("id", "textText");
        editorInput1.setAttribute("class", "dialog-input");
        editorInput1.style = "width: 50%;";
        editorInput1.value = editor.getSelected().getEl().text != undefined ? editor.getSelected().getEl().text : "";

        var saveButton = document.createElement("button");
        saveButton.innerHTML = "Save";
        saveButton.className = "gjs-btn-prim";
        saveButton.style = "margin-top: 8px;width: 60px;";
        saveButton.onclick = function () {
            component.set("content", "");
            //component.components(codeViewer.editor.getValue());
            //component.addAttributes({ href: codeViewer.editor.getValue() });
            var e_type = document.getElementById("ddlTarget_type");
            var value_type = e_type.options[e_type.selectedIndex].value;
            var type = value_type == 'MailTo' ? 'mailto:' : value_type == 'Telephone' ? 'tel:' : '';

            var e = document.getElementById("ddlTarget");
            var value = e.options[e.selectedIndex].value;
            if (value == 'New window') {
                component.addAttributes({
                    target: "_blank"
                });
            }

            component.addAttributes({
                href: type + document.getElementById('textHref').value,
                title: document.getElementById('textTitle').value
            });

            if (component.getAttributes().p5_btn == "true")
                component.getEl().text = document.getElementById('textText').value;

            editor.Modal.close();
        }
            ;


        var values = ["This window", "New window"];

        var label1 = document.createElement("label");
        label1.innerHTML = "Target:";
        label1.style = "margin-top: 10px;";

        var select = document.createElement("select");
        select.name = "Target";
        select.id = "ddlTarget"
        select.style = "width: 30%;appearance: auto;";

        for (const val of values) {
            var option = document.createElement("option");
            option.value = val;

            if (component.getAttributes().target != null) {
                option.selected = true;
            }
            option.text = val.charAt(0).toUpperCase() + val.slice(1);
            select.appendChild(option);
        }

        if (component.getAttributes().p5_btn == "true") {
            modalContent.appendChild(label2);
            modalContent.appendChild(editorInput1);
        }


        var values_type = ["Link", "MailTo", "Telephone"];
        var label2 = document.createElement("label");
        label2.innerHTML = "Type:";
        label2.style = "margin-top: 10px;";

        var select_type = document.createElement("select");
        select_type.name = "Target";
        select_type.id = "ddlTarget_type"
        select_type.style = "width: 30%;appearance: auto;";

        for (const val of values_type) {
            var option = document.createElement("option");
            option.value = val;
            if ((component.getAttributes().href != undefined) && val.toLowerCase().indexOf(component.getAttributes().href.toLowerCase().slice(0, 3)) > -1) {
                option.selected = true;
                label.innerHTML = val + ':';

                select.style.display = "block";
                label1.style.display = "block";
                if (component.getAttributes().href.toLowerCase().indexOf('tel') || component.getAttributes().href.toLowerCase().indexOf('mail')) {
                    select.style.display = "none";
                    label1.style.display = "none";
                }
            }
            option.text = val.charAt(0).toUpperCase() + val.slice(1);
            select_type.appendChild(option);
        }
        select_type.addEventListener('change', function handleChange(event) {

            select.style.display = "none";
            label1.style.display = "none";

            if (event.target.value == 'MailTo')
                label.innerHTML = 'MailTo:';
            else if (event.target.value == 'Telephone')
                label.innerHTML = 'Phonenumber:';
            else {
                label.innerHTML = "Href: ";
                select.style.display = "block";
                label1.style.display = "block";
            }
        });






        modalContent.appendChild(label2);
        modalContent.appendChild(select_type);
        modalContent.appendChild(label);
        modalContent.appendChild(editorInput);
        modalContent.appendChild(label1);
        modalContent.appendChild(select);
        modalContent.appendChild(label_title);
        modalContent.appendChild(editorInput_title);
        modalContent.appendChild(saveButton);

        //codeViewer.init(editorTextArea);

        //var htmlContent = document.createElement("div");
        //htmlContent.innerHTML = component.toHTML();
        //htmlContent = htmlContent.firstChild.innerHTML;
        //codeViewer.setContent(htmlContent);

        editor.Modal.setTitle("Insert Link").setContent(modalContent).open();

        //codeViewer.editor.refresh();
    },
});

editor.Commands.add("open-html-code-editor", {
    run: function (editor, sender, data) {
        var component = editor.getSelected();

        var codeViewer = editor.CodeManager.getViewer("CodeMirror").clone();
        codeViewer.set({
            codeName: "htmlmixed",
            theme: "hopscotch",
            readOnly: false,
        });

        var modalContent = document.createElement("div");

        var editorTextArea = document.createElement("textarea");

        var saveButton = document.createElement("button");
        saveButton.innerHTML = "Save";
        saveButton.className = "gjs-btn-prim";
        saveButton.style = "margin-top: 8px;";
        saveButton.onclick = function () {
            component.set("content", "");
            component.components(codeViewer.editor.getValue());
            editor.Modal.close();
        }
            ;

        modalContent.appendChild(editorTextArea);
        modalContent.appendChild(saveButton);

        codeViewer.init(editorTextArea);

        var htmlContent = document.createElement("div");
        htmlContent.innerHTML = component.toHTML();
        htmlContent = htmlContent.firstChild.innerHTML;
        codeViewer.setContent(htmlContent);

        editor.Modal.setTitle("Edit HTML").setContent(modalContent).open();

        codeViewer.editor.refresh();
    },
});

editor.Commands.add("set-device-desktop", {
    run: (editor) => editor.setDevice("Desktop"),
});

editor.Commands.add("set-device-mobile", {
    run: (editor) => editor.setDevice("Mobile"),
});

editor.Commands.add("gjs-undo-content", {
    run(editor, sender) {
        const um = editor.UndoManager;
        um.undo();
    }
});

editor.Commands.add("show-layers", {
    getRowEl(editor) {
        return editor.getContainer().closest(".editor-row");
    },
    getLayersEl(row) {
        return row.querySelector(".layers-container");
    },

    run(editor, sender) {
        const lmEl = this.getLayersEl(this.getRowEl(editor));
        lmEl.style.display = "";
    },
    stop(editor, sender) {
        const lmEl = this.getLayersEl(this.getRowEl(editor));
        lmEl.style.display = "none";
    },
});

editor.Commands.add("show-traits", {
    getTraitsEl(editor) {
        //document.getElementById('btnTraits').parentNode.style.display = "none"; //new changes
        const row = editor.getContainer().closest(".editor-row");
        return row.querySelector(".traits-container");
    },
    run(editor, sender) {
        this.getTraitsEl(editor).style.display = "";
    },
    stop(editor, sender) {
        this.getTraitsEl(editor).style.display = "none";
    },
});

editor.Commands.add("show-styles", {
    getRowEl(editor) {
        return editor.getContainer().closest(".editor-row");
    },
    getStyleEl(row) {
        return row.querySelector(".styles-container");
    },

    run(editor, sender) {
        const smEl = this.getStyleEl(this.getRowEl(editor));
        smEl.style.display = "";
        if (Selcted_Tag.attributes.tagName == 'img')
            document.getElementById('dvImgTitle').style.display = 'block';
    },
    stop(editor, sender) {
        const smEl = this.getStyleEl(this.getRowEl(editor));
        smEl.style.display = "none";
    },
});

editor.Commands.add("show-rows", {
    getRowEl(editor) {
        return editor.getContainer().closest(".editor-row");
    },
    getStyleEl(row) {
        return row.querySelector(".rows-container");
    },

    run(editor, sender) {
        const smEl = this.getStyleEl(this.getRowEl(editor));
        smEl.style.display = "";
        document.getElementById('dvImgTitle').style.display = 'none';
    },
    stop(editor, sender) {
        const smEl = this.getStyleEl(this.getRowEl(editor));
        smEl.style.display = "none";
    },
});

editor.Commands.add("show-blocks", {
    getRowEl(editor) {
        return editor.getContainer().closest(".editor-row");
    },
    getStyleEl(row) {
        return row.querySelector(".blocks-container");
    },

    run(editor, sender) {
        const smEl = this.getStyleEl(this.getRowEl(editor));
        smEl.style.display = "";
        document.getElementById('dvImgTitle').style.display = 'none';
    },
    stop(editor, sender) {
        const smEl = this.getStyleEl(this.getRowEl(editor));
        smEl.style.display = "none";
    },
});

editor.Panels.addPanel({
    id: "panel-top",
    el: ".panel__top",
});

editor.Panels.addPanel({
    id: "basic-actions",
    el: ".panel__basic-actions",
    buttons: [{
        id: "visibility",
        active: true,
        className: "btn-toggle-borders devicewrap",
        label: '<i class="fa fa-file-text-o" title="Show structure"></i>',
        command: "sw-visibility",
    }, {
        id: "preview",
        className: "btn-toggle-borders devicewrap",
        label: '<i class="fa fa-eye" title="Preview"></i>',
        command: "preview"
    }],
});

document.getElementsByClassName("gjs-sm-sector-title")[0].remove();

const rowsEl = editor.BlockManager.render(rows_list, {
    external: true,
});
document.getElementsByClassName("rows-container")[0].appendChild(rowsEl);

const bodyEle = editor.getWrapper();
bodyEle.set("stylable", editor.getWrapper().get("stylable").concat(["width", "max-width", "padding", "padding-top", "padding-right", "padding-bottom", "padding-left", "border", "border-top", "border-right", "border-left", "border-bottom",]));
bodyEle.setStyle({
    margin: "0 auto"
});

editor.on('component:selected', (some, argument) => {
    Selcted_Tag = some;
    document.getElementById("txtImageName").value = '';
    document.getElementById('dvImgTitle').style.display = 'none';
    if (some.attributes.tagName == 'img') {
        var getTitle = document.getElementsByClassName('gjs-frame')[0].contentWindow.document.getElementById(some.ccid).getAttribute("title")
        document.getElementById("txtImageName").value = getTitle != undefined ? getTitle : '';
    }

    document.getElementById('btnBlocks').click();
    editor.StyleManager.getSector('dimension').set({
        open: false
    });
    editor.StyleManager.getSector('typography').set({
        open: false
    });
    editor.StyleManager.getSector('decoration').set({
        open: false
    });

    if (some.attributes.tagName == 'a' && some.getAttributes().p5_btn == "false") {
        document.getElementById('btnBlocks').click();
        ;
    } else if (some.getAttributes()["data-social"] != 'true' && some.attributes.tagName != 'img') {

        document.getElementById('btnStyles').click();
        if (some.attributes.tagName == 'h1' || some.attributes.tagName == 'p' || (some.attributes.tagName == 'a' && some.getAttributes().p5_btn == "true")) {
            editor.StyleManager.getSector('typography').set({
                open: true
            });
        } else {
            editor.StyleManager.getSector('dimension').set({
                open: true
            });
        }

    }
}
)

editor.Commands.add("gjs-save-data", {
    run(editor, sender) {
        var css = editor.getCss();
        var jsonComponent = JSON.stringify(editor.getComponents());

        var html = editor.getHtml().replace(/body/g, 'div');
        document.getElementById("dvTemplate").innerHTML = html;

        var css_list = css.split('}');
        for (var t = 0; t < css_list.length; t++) {
            //if (css_list[t].indexOf('#') > -1) {
            var css_list_spt = css_list[t].split('{');
            var class_name = css_list_spt[0].replace('#', '').replace('.', '');
            var class_value = css_list_spt[1];
            if ((class_value != undefined) && class_value.indexOf('padding') > -1)
                class_value = class_value + 'box-sizing: border-box;';

            if (document.getElementById(class_name)) {
                document.getElementById(class_name).setAttribute("style", class_value);
            }
            else if (document.getElementsByClassName(class_name).length > 0) {
                var ele = document.getElementsByClassName(class_name);
                for (var i = 0; i < ele.length; i++) {
                    ele[i].setAttribute("style", class_value);
                }
            }
            // }
        }

        for (var i = 0; i < document.getElementsByTagName('img').length; i++) {
            document.getElementsByTagName('img')[i].setAttribute("data-gjs-type", "image");
        }

        $.each($('#dvTemplate a'), function () {
            var btn = $(this)[0];
            if ((btn != undefined) && btn.id != "" && btn.getAttribute('p5_btn') == 'true')
                btn.innerText = document.getElementsByClassName('gjs-frame')[0].contentWindow.document.getElementById(btn.id).innerHTML;
            else if (href_Arr.length > 0 && href_Arr.find(f => f.id == btn.id) != undefined)
                btn.setAttribute("href", href_Arr.find(f => f.id == btn.id).href);
        });

        if (tag_Arr.length > 0) {
            for (var t = 0; t < tag_Arr.length; t++) {
                var datatext = document.getElementById(tag_Arr[t].id).innerHTML.toString();
                var newdata = datatext.replace("[{*p5tag*}]", tag_Arr[t].tag);
                document.getElementById(tag_Arr[t].id).innerHTML = newdata;
            }
        }

        if (img_Title.length > 0) {
            for (var t = 0; t < img_Title.length; t++) {
                $("#" + img_Title[t].id).attr("title", img_Title[t].title);
                $("#" + img_Title[t].id).attr("alt", img_Title[t].title);
            }
        }
        var final_html = '<html xmlns="http://www.w3.org/1999/xhtml"><head><title></title></head><body>' + document.getElementById("dvTemplate").innerHTML + '</body></html>';
        console.log(final_html);

        EditorUtil.UpdateTemplate(final_html, "");

        //alert("Saved sucessfully.");
    }
});

//document.getElementById("dvTemplate").innerHTML = `<html xmlns="http://www.w3.org/1999/xhtml"><head><title></title></head><body><div id="i2cr" style="margin:0 auto;"><img src="https://app.plumb5.com/p5-editor/facebook@2x.png" id="i3mm" data-gjs-type="image"></div></body>`;

//document.getElementById("dvTemplate").innerHTML = '<html xmlns="http://www.w3.org/1999/xhtml"><head><title></title></head><body><div id="i5mh" style="margin:0 auto;"><title></title><div id="ibty" style="margin:0 auto;"><title></title><div id="i99f" style="margin:0 auto;"><title></title><div id="i0w1" style="margin:0 auto;"><title></title><div id="irgu" style="margin:0 auto;border-radius:0px 0px 0px 0px;"><div id="ispj" style="margin:0 auto;width:80%;padding:0px 20px 20px 20px;float:none;border:1px solid #000000;"> <a name="Link" data-link-code="" id="ilnq8" href="http://plumb5.com" style="display:inline-block;min-width:100px;min-height:40px;padding:10px;"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABQAAAALQCAYAAADPfd1WAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo5ZGNhZTRjNy0yMzhiLTk3NDAtYTM0NS1hNGY4YWNlNjE1MDUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QkRGNTIxRTNCQTE5MTFFQjk5NkQ5RTQ3QTE4QTRFNTgiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QkRGNTIxRTJCQTE5MTFFQjk5NkQ5RTQ3QTE4QTRFNTgiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6ODc3NWY5MmYtYmZmNi1mYzRlLWFlMWEtMDg3ODAzYTNlOWY1IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjlkY2FlNGM3LTIzOGItOTc0MC1hMzQ1LWE0ZjhhY2U2MTUwNSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PmGs0UcAAEXuSURBVHja7N0HmCVFtQDgHokSl+gMsypJEUEEQQURWdSHAfURBLOgGDCgGEF2zLOK+FQUMzzl+dCniICCohIkKygIiCgSRNhxliSLsmTYd4rbK7uwaXZvqur//77z9Yhwb/Xp6tt1z62uHpg9e3YFAAAAAJRpQAEQAAAAAMqlAAgAAAAABVMABAAAAICCKQACAAAAQMEUAAEAAACgYAqAAAAAAFAwBUAAAAAAKJgCIAAAAAAUTAEQAAAAAAqmAAgAAAAABVMABAAAAICCKQACAAAAQMEUAAEAAACgYAqAAAAAAFAwBUAAAAAAKJgCIAAAAAAUTAEQAAAAAAqmAAgAAAAABVMABAAAAICCKQACAAAAQMEUAAEAAACgYAqAAAAAAFAwBUAAAAAAKJgCIAAAAAAUTAEQAAAAAAqmAAgAAAAABVMABAAAAICCKQACAAAAQMEUAAEAAACgYAqAAAAAAFAwBUAAAAAAKJgCIAAAAAAUTAEQAAAAAAqmAAgAAAAABVMABAAAAICCKQACAAAAQMEUAAEAAACgYAqAAAAAAFAwBUAAAAAAKJgCIAAAAAAUTAEQAAAAAAqmAAgAAAAABVMABAAAAICCKQACAAAAQMEUAAEAAACgYAqAAAAAAFAwBUAAAAAAKJgCIAAAAAAUTAEQAAAAAAqmAAgAAAAABVMABAAAAICCKQACAAAAQMEUAAEAAACgYAqAAAAAAFAwBUAAAAAAKJgCIAAAAAAUTAEQAAAAAAqmAAgAAAAABVMABAAAAICCKQACAAAAQMEUAAEAAACgYAqAAAAAAFAwBUAAAAAAKJgCIAAAAAAUTAEQAAAAAAqmAAgAAAAABVMABAAAAICCKQACAAAAQMEUAAEAAACgYAqAAAAAAFAwBUAAAAAAKJgCIAAAAAAUTAEQAAAAAAqmAAgAAAAABVMABAAAAICCKQACAAAAQMEUAAEAAACgYAqAAAAAAFAwBUAAAAAAKJgCIAAAAAAUTAEQAAAAAAqmAAgAAAAABVMABAAAAICCKQACAAAAQMEUAAEAAACgYAqAAAAAAFAwBUAAAAAAKJgCIAAAAAAUTAEQAAAAAAqmAAgAAAAABVMABAAAAICCKQACAAAAQMEUAAEAAACgYAqAAAAAAFAwBUAAAAAAKJgCIAAAAAAUTAEQAAAAAAqmAAgAAAAABVMABAAAAICCKQACAAAAQMEUAAEAAACgYAqAAAAAAFAwBUAAAAAAKJgCIAAAAAAUTAEQAAAAAAqmAAgAAAAABVMABAAAAICCKQACAAAAQMEUAAEAAACgYAqAAAAAAFAwBUAAAAAAKJgCIAAAAAAUTAEQAAAAAAqmAAgAAAAABVMABAAAAICCKQACAAAAQMEUAAEAAACgYAqAAAAAAFAwBUAAAAAAKJgCIAAAAAAUTAEQAAAAAAqmAAgAAAAABVMABAAAAICCKQACAAAAQMEUAAEAAACgYAqAAAAAAFAwBUAAAAAAKJgCIAAAAAAUTAEQAAAAAAqmAAgAAAAABVMABAAAAICCKQACAAAAQMEUAAEAAACgYAqAAAAAAFAwBUAAAAAAKJgCIAAAAAAUTAEQAAAAAAqmAAgAAAAABVMABAAAAICCKQACAAAAQMEUAAEAAACgYAqAAAAAAFAwBUAAAAAAKJgCIAAAAAAUTAEQAAAAAAqmAAgAAAAABVMABAAAAICCKQACAAAAQMEUAAEAAACgYAqAAAAAAFAwBUAAAAAAKJgCIAAAAAAUTAEQAAAAAAqmAAgAAAAABVMABAAAAICCKQACAAAAQMEUAAEAAACgYAqAAAAAAFAwBUAAAAAAKJgCIAAAAAAUTAEQAAAAAAqmAAgAAAAABVMABAAAAICCKQACAAAAQMEUAAEAAACgYAqAAAAAAFAwBUAAAAAAKJgCIAAAAAAUTAEQAAAAAAqmAAgAAAAABVMABAAAAICCKQACAAAAQMEUAAEAAACgYAqAAAAAAFAwBUAAAAAAKJgCIAAAAAAUTAEQAAAAAAqmAAgAAAAABVMABAAAAICCKQACAAAAQMEUAAEAAACgYAqAAAAAAFAwBUAAAAAAKJgCIAAAAAAUTAEQAAAAAAqmAAgAAAAABVMABAAAAICCKQACAAAAQMEUAAEAAACgYAqAAAAAAFAwBUAAAAAAKJgCIAAAAAAUTAEQAAAAAAqmAAgAAAAABVMABAAAAICCKQACAAAAQMEUAAEAAACgYAqAAAAAAFAwBUAAAAAAKJgCIAAAAAAUTAEQAAAAAAqmAAgAAAAABVMABAAAAICCKQACAAAAQMEUAAEA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YEwAAgAAAMCYAAQAAACAMQEIAAAAAGMCEAAAAADGBCAAAAAAjAlAAAAAABgTgAAAAAAwJgABAAAAYEwAAgAAAMCYAAQAAACAMQEIAAAAAGMCEAAAAADGBCAAAAAAjAlAAAAAABgTgAAAAAAwJgABAAAAYEwAAgAAAMCYAAQAAACAMQEIAAAAAGMCEAAAAADGBCAAAAAAjAlAAAAAABgTgAAAAAAwJgABAAAAYEwAAgAAAMCYAAQAAACAMQEIAAAAAGMCEAAAAADGBCAAAAAAjAlAAAAAABgTgAAAAAAwJgABAAAAYEwAAgAAAMCYAAQAAACAMQEIAAAAAGMCEAAAAADGBCAAAAAAjAlAAAAAABgTgAAAAAAwJgABAAAAYEwAAgAAAMCYAAQAAACAMQEIAAAAAGMCEAAAAADGBCAAAAAAjAlAAAAAABgTgAAAAAAwJgABAAAAYEwAAgAAAMCYAAQAAACAMQEIAAAAAGMCEAAAAADGBCAAAAAAjAlAAAAAABgTgAAAAAAwJgABAAAAYEwAAgAAAMCYAAQAAACAMQEIAAAAAGMCEAAAAADGBCAAAAAAjAlAAAAAABgTgAAAAAAwJgABAAAAYEwAAgAAAMCYAAQAAACAMQEIAAAAAGMCEAAAAADGBCAAAAAAjAlAAAAAABgTgAAAAAAwJgABAAAAYEwAAgAAAMCYAAQAAACAMQEIAAAAAGMCEAAAAADGBCAAAAAAjAlAAAAAABgTgAAAAAAwJgABAAAAYEwAAgAAAMCYAAQAAACAMQEIAAAAAGMCEAAAAADGBCAAAAAAjAlAAAAAABgTgAAAAAAwJgABAAAAYEwAAgAAAMCYAAQAAACAMQEIAAAAAGMCEAAAAADGBCAAAAAAjAlAAAAAABgTgAAAAAAwJgABAAAAYEwAAgAAAMCYAAQAAACAMQEIAAAAAGMCEAAAAADGBCAAAAAAjAlAAAAAABgTgAAAAAAwJgABAAAAYEwAAgAAAMCYAAQAAACAMQEIAAAAAGMCEAAAAADGBCAAAAAAjAlAAAAAABgTgAAAAAAwJgABAAAAYEwAAgAAAMCYAAQAAACAMQEIAAAAAGMCEAAAAADGBCAAAAAAjAlAAAAAABgTgAAAAAAwJgABAAAAYEwAAgAAAMCYAAQAAACAsQQYAOsd550wl0NRAAAAAElFTkSuQmCC" id="itko2" style="height:91px;width:162px;" data-gjs-type="image"></a><h1 id="i573" style="color:#42219f;">Contextually Engage</h1><p id="id7c" style="color:#000000;font-family:Verdana;">Plumb5 is a state machine that is capable of real-time engagement regardless of any customer touch-point. <br>The secret sauce behind this machine is the ability to compute in real-time and output customer states, <br>which is consumed by the automation engine to respond based on rules for any kind of customer request. <br>Everything in real-time. 24/7.</p><div id="i6uxk" class="col-2-wrap" style="width:100%;overflow:hidden;"><div id="invjb" style="width:50%;min-height:30px;float:left;"><img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAeAB4AAD/4RDuRXhpZgAATU0AKgAAAAgABAE7AAIAAAAMAAAISodpAAQAAAABAAAIVpydAAEAAAAYAAAQzuocAAcAAAgMAAAAPgAAAAAc6gAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFNoZWV0YWwgUmFtAAAFkAMAAgAAABQAABCkkAQAAgAAABQAABC4kpEAAgAAAAMzMAAAkpIAAgAAAAMzMAAA6hwABwAACAwAAAiYAAAAABzqAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAyMjoxMTowMyAxMTozNDo0MwAyMDIyOjExOjAzIDExOjM0OjQzAAAAUwBoAGUAZQB0AGEAbAAgAFIAYQBtAAAA/+ELHmh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8APD94cGFja2V0IGJlZ2luPSfvu78nIGlkPSdXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQnPz4NCjx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iPjxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+PHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9InV1aWQ6ZmFmNWJkZDUtYmEzZC0xMWRhLWFkMzEtZDMzZDc1MTgyZjFiIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iLz48cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0idXVpZDpmYWY1YmRkNS1iYTNkLTExZGEtYWQzMS1kMzNkNzUxODJmMWIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+PHhtcDpDcmVhdGVEYXRlPjIwMjItMTEtMDNUMTE6MzQ6NDMuMzA0PC94bXA6Q3JlYXRlRGF0ZT48L3JkZjpEZXNjcmlwdGlvbj48cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0idXVpZDpmYWY1YmRkNS1iYTNkLTExZGEtYWQzMS1kMzNkNzUxODJmMWIiIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyI+PGRjOmNyZWF0b3I+PHJkZjpTZXEgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj48cmRmOmxpPlNoZWV0YWwgUmFtPC9yZGY6bGk+PC9yZGY6U2VxPg0KCQkJPC9kYzpjcmVhdG9yPjwvcmRmOkRlc2NyaXB0aW9uPjwvcmRmOlJERj48L3g6eG1wbWV0YT4NCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgPD94cGFja2V0IGVuZD0n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BXZz1zu7d69A6e2OeO3uPajp7Y547e49qfM73/r+tE/VfcuVWt/X9atemhznhfw9d6JrHiS6u5IWj1TUvtkAhJJRPKROcgd1PAzxiuj6e2OeO3uPajp7Y547e49qOntjnjt7j2qe3l+n9f10oOntjnjt7j2o6e2OeO3uPajp7Y547e49qOntjnjt7j2o/r+v6/4AHT2xzx29x7UdPbHPHb3HtR09sc8dvce1HT2xzx29x7Uf1/X9f8ADp7Y547e49qOntjnjt7j2o6e2OeO3uPajp7Y547e49qP6/r+v+AB09sc8dvce1HT2xzx29x7UdPbHPHb3HtR09sc8dvce1H9f1/X/AAAOntjnjt7j2o/780dPbHPHb3HtR/35oAOntjnjt7j2o6e2OeO3uPajp7Y547e49qOntjnjt7j2o/r+v6/4Ac9q3hGLUfEUOuWeq6hpGoxWptXmsTE3mRFgwBWWN1IDZIIAIyea43xv4Bi0/wCG40PRYdR1GO51yC7nVneaUK86tI25Ru2gZO4nI6k969T6e2OeO3uPajp7Y547e49qadreX+d/z/rsnqmv62sc3pngu2sddi1e+1PUtWvLWAwWj30iMLRG+9sCIu4twCz7mIA5654nwP8ADyS/8Kanb6xea3pkF9qd215pysI0uozM2Dh0LqrJgExsm4dz1r1rp7Y547e49qOntjnjt7j2oTa+6343/T+uh/w/4WMjWvDOm654Wm8PXcTRWEkKxqtu21oQuCjIe20gEfTpWfZ+CI4PEtlr1/rmranf2MUsUTXTxBFSTGfkjjRe3UDPPJIAA6fp7Y547e49qOntjnjt7j2ou73/AK/r+vQsrWOZtfAumWng3UvDST3Zs9RNw00hdTInnklyp24x8xxkHHfNNufA1u2pWOo6bq2paTfWViLD7RZmFjLACCAyyxupwRnIAPJrqOntjnjt7j2o6e2OeO3uPalt/Xy/L+uz/r7zj1+Gmjp4aOhi61A239pjVDI84eUSiQSfeZSWXI5zk++eayviZ4a/4SrxR4NsPsNxJHDfvdXVzHExiigRQzIzYxh2CAAntXovT2xzx29x7UdPbHPHb3HtVKTTT7a/19y/rZNXv5/r/wAOzJ8ReHbXxJYQ291NPayWtzHd21zalRJbyocq6bgykdQQQRgniq6eFLf/AISPTddur68ub/TrOS1W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" id="iei4h" style="width:333px;height:258px;" data-gjs-type="image"></div><div id="ikx2s" style="width:50%;min-height:30px;float:left;"><p id="iq9mo" style="color:#000000;font-family:Verdana;"><b id="idv8j" style="color:#42219f;">Automate Your Growth Strategy</b><br><br>Plumb5 helps you grow your business exponentially, by intelligently automating your conversion and retention strategies. Plumb5 does this by connecting all your customer touch-points and applying autosegmentation and learning techniques.<br></p></div></div><div id="i0p4a" class="dividerwrap" style="width:100%;min-width:30px;"><div id="ipsee" style="height:1px;background-color:#ccc;"></div></div><div id="ioywg" style="height:20px;outline:none;"></div><div id="igrxf" style="margin:10px;text-align:center;"><div name="11" id="i4u63" class="p5_social" style="background-image:url(https://app.plumb5.com/p5-editor/facebook@2x.png);height:35px;width:40px;background-size:contain;background-repeat:no-repeat;display:inline-block;"><a data-social="true" href="http://www.facebook.com" data-link-code="" id="id8ex" style="display:inline-block;width:40px;height:40px;padding:10px;"></a></div><div name="22" id="iwg2l" class="p5_social" style="background-image:url(https://app.plumb5.com/p5-editor/twitter@2x.png);height:35px;width:40px;background-size:contain;background-repeat:no-repeat;display:inline-block;"><a data-social="true" href="http://www.twitter.com" data-link-code="" id="ir0n6" style="display:inline-block;width:40px;height:40px;padding:10px;"></a></div><div name="33" id="i1cek" class="p5_social" style="background-image:url(https://app.plumb5.com/p5-editor/instagram@2x.png);height:35px;width:40px;background-size:contain;background-repeat:no-repeat;display:inline-block;"><a data-social="true" href="http://www.instagram.com" data-link-code="" id="igpwx" style="display:inline-block;width:40px;height:40px;padding:10px;"></a></div><div name="44" id="i353j" class="p5_social" style="background-image:url(https://app.plumb5.com/p5-editor/linkedin@2x.png);height:35px;width:40px;background-size:contain;background-repeat:no-repeat;display:inline-block;"><a data-social="true" href="http://www.linkedin.com" data-link-code="" id="ilnm2" style="display:inline-block;width:40px;height:40px;padding:10px;"></a></div><div name="55" id="i30xs" class="p5_social" style="background-image:url(https://app.plumb5.com/p5-editor/youtube@2x.png);height:35px;width:40px;background-size:contain;background-repeat:no-repeat;display:inline-block;"><a data-social="true" href="http://www.youtube.com" data-link-code="" id="i2ydm" style="display:inline-block;width:40px;height:40px;padding:10px;"></a></div><div name="66" id="ilf9i" class="p5_social" style="background-image:url(https://app.plumb5.com/p5-editor/whatsapp@2x.png);height:35px;width:40px;background-size:contain;background-repeat:no-repeat;display:inline-block;"><a data-social="true" href="http://www.whatsapp.com" data-link-code="" id="iq813" style="display:inline-block;width:40px;height:40px;padding:10px;"></a></div></div><div id="ifqfk" style="margin:10px;text-align:center;"></div></div></div></div></div></div></div></body>';
////editor.setComponents('<div id="ispj" style="margin:0 auto;width:80%;padding:0px 20px 20px 20px;">sfsfasf</div>')
//bindTemplate();
//function bindTemplate() {
//    var finalHtml = document.getElementById("dvTemplate").innerHTML;//.replace(/pbody/g, 'body');
//    editor.setComponents(finalHtml);
//}

var EditorEmailUtil = {
    BindContactFields: function (fieldList) {
        $.each(defaultContactFields, function (i) {
            ddlContactFields += '<option value="' + defaultContactFields[i] + '">' + defaultContactFields[i] + '</option>';
            ;
        });

        if (fieldList != undefined && fieldList != null && fieldList.length > 0) {
            $.each(fieldList, function (i) {
                ddlContactFields += '<option value="' + $(this)[0].FieldName + '">' + $(this)[0].FieldName + '</option>';
                ;

            }); 
        }
        if (TaggingLmsCustomFields != undefined && TaggingLmsCustomFields != null && TaggingLmsCustomFields.length > 0) {
            
            ddlContactFields += '<option value="UserInfo^firstname">UserInfoName</option>';
            ddlContactFields += '<option value="UserInfo^lastname">UserInfoLastName</option>';
            ddlContactFields += '<option value="UserInfo^emailid">UserInfoEmailId</option>';
            ddlContactFields += '<option value="UserInfo^mobilephone">UserInfoPhoneNumber</option>';
            $.each(TaggingLmsCustomFields, function (i) {
                ddlContactFields += '<option value="' + TaggingLmsCustomFields[i].FieldDisplayName + '">' + TaggingLmsCustomFields[i].FieldDisplayName + '</option>';
                ;

            });
        }
    }
}

function GetMailImages() {
    $.ajax({
        url: "/Mail/DesignTemplateWithP5Editor/GetTemplateImagesFiles",
        type: 'POST',
        data: JSON.stringify({
            'accountId': Plumb5AccountId
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            $.each(result, function () {
                editor.AssetManager.add({
                    src: this.ImageUrl,
                    height: this.Height,
                    width: this.Width,
                    name: this.Name
                });
            })
        },
        error: ShowAjaxError
    });
}

document.getElementById("txtImageName").addEventListener("keyup", myImageTitle);
function myImageTitle() {

    var tagid = editor.getSelected().ccid;
    document.getElementsByClassName('gjs-frame')[0].contentWindow.document.getElementById(tagid).setAttribute("title", document.getElementById("txtImageName").value);

    if (img_Title.length > 0 && img_Title.find(f => f.id == tagid) != undefined) {
        var index = img_Title.findIndex(x => x.id === tagid);
        img_Title.splice(index, 1);
        img_Title.push({ "id": tagid, "title": document.getElementById("txtImageName").value });
    }
    else img_Title.push({ "id": tagid, "title": document.getElementById("txtImageName").value });
}

function AddImageOnclick() {
    $('.gjs-am-asset-image').unbind();
    $('.gjs-am-asset-image').click(function () {
        var tagid = editor.getSelected().ccid;
        document.getElementsByClassName('gjs-frame')[0].contentWindow.document.getElementById(id).setAttribute("title", document.getElementById("txtImageName").value);

        if (img_Title.length > 0 && img_Title.find(f => f.id == tagid) != undefined) {
            var index = img_Title.findIndex(x => x.id === tagid);
            img_Title.splice(index, 1);
            img_Title.push({ "id": tagid, "title": document.getElementById("txtImageName").value });
        }
        else img_Title.push({ "id": tagid, "title": document.getElementById("txtImageName").value });
    });


}

editor.on("run:open-assets", function () {
    AddImageOnclick();
})