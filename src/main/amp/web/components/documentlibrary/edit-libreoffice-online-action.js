YAHOO.Bubbling.fire("registerAction", {
  actionName: "onActionEditInLibreOfficeOnline",
  fn: function (node) {
    var LOOL_GET_TOKEN = Alfresco.constants.PROXY_URI + "lool/token";

    Alfresco.util.Ajax.jsonGet(
        {
          url: LOOL_GET_TOKEN + "?nodeRef=" + encodeURIComponent(node.nodeRef) + "&action=edit",
          successCallback: {
            fn: function (response) {
              var access_token = response.json.access_token;
              var wopi_src_url = response.json.wopi_src_url;
              console.log(access_token, wopi_src_url);

              // Get fileId from nodeRef (just use the uuid part)
              var fileId = Alfresco.util.NodeRef(node.nodeRef).id;

              //var wopiFileURL = Alfresco.constants.PROXY_URI + "wopi/files/" + fileId;
              // TODO: Use the commented out line above.. the following line is
              // a hack:
              var wopiFileURL = "https://alfedu.magenta.dk/alfresco/service/" + "wopi/files/" + fileId;

              var frameSrcURL = wopi_src_url + "WOPISrc=" + encodeURIComponent(wopiFileURL);

              require(["jquery"], (function ($) {
                var form = '<form id="loleafletform" name="loleafletform" target="loleafletframe" action="' + frameSrcURL + '" method="post">' +
                    '<input name="access_token" value="' + encodeURIComponent(access_token) + '" type="hidden"/></form>';
                var frame = '<iframe id="loleafletframe" name= "loleafletframe" allowfullscreen style="width:100%;height:100%;position:absolute;"/>';

                $('#loolcontainer').remove();

                var container = '<div id="loolcontainer" style="position: fixed; height: 100%; width: 100%; top: 0; left: 0; background: white;"></div>';
                $('body').append(container);
                var loolContainer = $('#loolcontainer');

                loolContainer.append(form);
                loolContainer.append(frame);

                $('#loleafletframe').load(function () {
                  console.log("Loaded loleafletframe");
                });

                $('#loleafletform').submit();
              }));
            },
            scope: this
          },
          failureMessage: "Server error - could not lookup token!"
        }
    );
  }
});