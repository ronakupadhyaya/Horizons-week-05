$(document).ready(function(){
  $('.add-cart').click(function(e){
    e.preventDefault();
    var href= $(this).attr('href');
    var self = $(this);
    axios.post(href)
    .then(function(resp){
      var count = parseInt(self.parent().siblings('.priceXCount').find('#count').text());
      self.parent().siblings('.priceXCount').find('#count').text(count+1);
    })

  });

  $('.remove-cart').click(function(e){
    e.preventDefault();
    var href=$(this).attr('href');
    var self = $(this);
    axios.post(href)
    .then(function(resp){
      console.log(resp);
      var count = parseInt(self.parent().siblings('.priceXCount').find('#count').text());
      if( count === 1){
        self.closest('.row').remove();
      } else{
        self.parent().siblings('.priceXCount').find('#count').text(count-1);
      }

    });
  });

  $('.delete-cart').click(function(e){
    e.preventDefault();
    var href=$(this).attr('href');
    var self = $(this);
    axios.post(href)
    .then(function(resp){
      console.log('Resp', resp);
      self.parent().siblings('.container').empty();
    })
  })
})
