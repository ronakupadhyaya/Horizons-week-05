$(document).ready(function(){
  $('.add-cart').click(function(e){
    e.preventDefault();
    var href= $(this).attr('href');
    console.log("HREF", href);
    axios.post(href)
    .then(function(resp){
      console.log("ATNOERHONE", resp);
      $('.add-cart').after(resp.data);
    })

  })
})
