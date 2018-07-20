// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

$(document).ready(function() { //Sets max length to 13, 8
  if($('#isbnmode').is(':checked')) {
    $('#input').attr('maxlength','13'); }
  if($('#oclcmode').is(':checked')) {
    $('#input').attr('maxlength','10'); }
});

function clearMetadata() { //Clears Metadata
  $(".metadata").html("");
}

$.fn.press = function() { //Submit function
  clearMetadata();
  if($('#isbnmode').is(':checked')) {
    var isbn = $('#input').val().replace(/\s/g, '');
    apcallisbn(isbn);
    $("#amazon").load("templates/amazon.html");
    $('#input').select(); }
  if($('#oclcmode').is(':checked')) {
    var oclc = $('#input').val().replace(/\s/g, '');
    apcalloclc(oclc);
    $("#amazon").load("templates/amazon.html");
    $('#input').select(); }
};

$("#subbutton").click(function() { //Clicking "Sub" button counts as submit
  $("#subtutton").press();
});

$(document).keypress(function(e) { //Pressing "enter" key counts as submit
    if(e.which == 13) {
      if ($('#input').is(':focus')) {
        $("#subtutton").press();
      }
    }
});

function apcallisbn(isbn){ //All the crap submit does for an ISBN input

  var request = require('request');
  var url = 'http://www.worldcat.org/webservices/catalog/search/worldcat/opensearch?q=' + isbn;
  var queryParams = '&' +  encodeURIComponent('wskey') + '=' + encodeURIComponent('uwpGfFREPIyE38NK4wmJATF53xA1E2qMbIM2ksm1ZPfxtXGVWEccdDb8qb1oqjF2rC85WWC4mQpMahuZ');

  request({
      url: url + queryParams,
      method: 'GET'
  },
  function (error, response, body) {
      //console.log(body);

      var parseString = require('xml2js').parseString;
      parseString(body, function (err, result) {
          console.dir(result);  //Object > feed: > entry: Array(#) > blah

        if(result==undefined || !result.feed.hasOwnProperty('entry')){ //If it screws up
          $("#failureISBN").css("display", "inline");
        }else{
          fields = result.feed.entry[result.feed.entry.length - 1]

            //look up js 'has property' function

          Title = result.feed.entry[0].title[0] //Get the title
            $("#Title").html("<b>Title: </b>" + Title);

          Title2 = fields.title[0]
          if(Title != Title2){
            $("#Title2").html("<b>Second Title: </b>" + Title2);
          }

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

function apcalloclc(oclc){ //All the crap submit does for an OCLC input
  var request = require('request');
  var url = 'http://www.worldcat.org/webservices/catalog/content/' + oclc;
  var queryParams = '?servicelevel=full&' +  encodeURIComponent('wskey') + '=' + encodeURIComponent('uwpGfFREPIyE38NK4wmJATF53xA1E2qMbIM2ksm1ZPfxtXGVWEccdDb8qb1oqjF2rC85WWC4mQpMahuZ');

  request({
      url: url + queryParams,
      method: 'GET'
  },
  function (error, response, body) {
      console.log(body);

      var parseString = require('xml2js').parseString;
      parseString(body, function (err, result) {
          console.dir(result);

          if(result==undefined || !result.record.hasOwnProperty('datafield')){ //If it screws up
            $("#failureOCLC").css("display", "inline");
          }else{
            fields = result.record.datafield

            for (i = 0; i < fields.length; ++i) {
                if(fields[i].$.tag == "020"){
                  var isbn = fields[i].subfield[0]._
                  if(isbn.length == 13){
                    //$("#isbbn").html("<b>ISBN: </b>" + isbn);
                    apcallisbn(isbn);
                  }
                }
                /*
              //  if(fields[i].$.tag == 100){
                  var Author = fields[i].subfield[0]._
                  $("#Author").html("<b>Author: </b>" + Author); }

                if(fields[i].$.tag == 245){
                  var Title = fields[i].subfield[0]._
                  $("#Title").html("<b>Title: </b>" + Title); }

                $("#oclc").html("<b>OCLC: </b>" + oclc);

                $("#link").html("<b>Additional Information: </b>" + 'http://worldcat.org/oclc/' + oclc);
                */
            }
          }
      });
  });
}
