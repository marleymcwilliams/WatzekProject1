// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
$(document).ready(function()
{
    $('#isbn').attr('maxlength','13');
});

function clearMetadata(){
  $(".metadata").html("");
}

$.fn.press = function(){
  clearMetadata();
  var isbn = $('#isbn').val().replace(/\s/g, '');
  apcall(isbn);
  console.log(isbn);
  $("#amazon").load("templates/amazon.html");
  $('#isbn').val('');
};

$("#subbutton").click(function() {
  $("#subtutton").press();
});

$(document).keypress(function(e) {
    if(e.which == 13) {
      if ($('#isbn').is(':focus')) {
        $("#subtutton").press();
      }
    }
});


function apcall(isbn){

  var request = require('request');
  var url = 'http://www.worldcat.org/webservices/catalog/search/worldcat/opensearch?q=' + isbn;
  var queryParams = '&' +  encodeURIComponent('wskey') + '=' + encodeURIComponent('uwpGfFREPIyE38NK4wmJATF53xA1E2qMbIM2ksm1ZPfxtXGVWEccdDb8qb1oqjF2rC85WWC4mQpMahuZ');

  request({
      url: url + queryParams,
      method: 'GET'
  },
  function (error, response, body) {
      console.log(body);

      var parseString = require('xml2js').parseString;
      parseString(body, function (err, result) {
          console.dir(result);  //Object > feed: > entry: Array(#) > blah

        if(result==undefined || !result.feed.hasOwnProperty('entry')){ //If it screws up
          console.log("fail");
          $("#failure").css("display", "inline");
/*        }elseif(arguments['0'].includes('Cannot read property')){
          window.console.error.apply(window.console, arguments)
          $("#failure").css("display", "inline");
*/
        }else{
          fields = result.feed.entry[result.feed.entry.length - 1]

            //look up js 'has property' function

          Title = fields.title[0] //Get the title
            $("#Title").html("<b>Title: </b>" + Title);

          Author = fields.author[0].name[0] //Get the Author
            $("#Author").html("<b>Author: </b>" + Author);

          oclc = fields['oclcterms:recordIdentifier'][0] //Get the OCLC Number
            $("#oclc").html("<b>OCLC: </b>" + oclc);

            $("#isbbn").html("<b>ISBN: </b>" + isbn); //Print out the ISBN

          link = fields.link[0].$.href //Get a link to worldcat (for additional info)
            $("#link").html("<b>Additional Information: </b>" + link);

      }
      });
  });

}
