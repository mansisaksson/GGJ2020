$(document).ready(function() {
    $.ajax({
        type: 'GET',
        url: '../scripts/get_wiki_content.php',
        dataType: "text",
        data: {
            Country: "Japan"
        },
        success: function(data) {
            console.log(data);
        }
    });
});