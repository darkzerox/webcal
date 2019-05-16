(function ($) {


  $(document).ready(function () {



    //social share
    $("#share").jsSocials({
      shares: ["email", "twitter", "facebook", "pinterest", ]
    });

    var title = $(document).prop('title');
    var global_select_packet = []
    var sum = 0

    $.ajax({
      url: "/src/db/price.json",
      dataType: 'json',
      success: function (jsonData) {

        var packet = jsonPath(jsonData, "$..packets");
        var packethtml = ''

        packet[0].forEach(res => {
          // console.log(res)
          packethtml += `    
          <p>
            <label>
              <input class="packet" name="packet-item" type="radio" id="${res.packet}" val="${res.packet}" />
              <span>${res.label}</span>
            </label>      
          </p>
          `
        });
        packethtml = `<div>${packethtml}</div>`;

        $('#packet_section').html('').html(packethtml)

        $('.packet').click(function () {

          setTimeout(() => {
            setPacket_from_Store()
          }, 100);

          var pk = $(this).attr('val')
          //set packet local store

          localStorage.setItem('packet', pk)
          // console.log(pk)



          var packetData = jsonPath(jsonData, "$.." + pk);

          var packet_basic = jsonPath(packetData, "$..basic");
          var packet_ecomerce = jsonPath(packetData, "$..ecommerce");
          var packet_extra = jsonPath(packetData, "$..extra");
          var packet_server = jsonPath(packetData, "$..server");

          getOptionData(packet_basic, 'packet_option', 'Basic Option')
          getOptionData(packet_ecomerce, 'packet_ecommerce', 'Ecommerce Option')
          getOptionData(packet_extra, 'packet_extra', 'Extra Option')
          getOptionData(packet_server, 'packet_server', 'Server Option')
          selectEvent()
        })
      },
    });


    function getOptionData(data_list, el, title) {
      let html_skele = `<h3>${title}</h3>`;
      $.each(data_list, function (i, obj) {
        $.each(obj, function (key, val) {
          // console.log(val.option_dynamic)
          var amount = ''
          if (val.option_dynamic == true) {
            amount = `
                      
            <p class="range-field">
              <input type="number" class="item-amount" placeholder="Input page amount" />
             
            </p>

            `
          }
          html_skele += `
          
            <div class="option-item ">              
              <label>
              <input type="checkbox" class="custom-control-input option-val" id="${val.option_key}" value="${val.option_price}" >
              <span>${val.option_label} : ${val.option_price}</span>
              </label>
              ${amount}      
          </div>
      `
        });
      });

      $('#' + el).html('').html(html_skele)


      amount_click()




    }

    function amount_click() {
      $('.item-amount').change(function () {
        // console.log($(this).val())
        $(this).parent().parent().find('.option-val').prop('checked', true)
      })
    }

    function selectEvent() {
      $('.option-item').on('change', function (event) {

        let is_active = $(this).find('.option-val').prop("checked");
        // console.log(is_active)
        let item_amount = $(this).find('.item-amount').val();
        // console.log('item_amount ' + item_amount)

        let id = $(this).find('.option-val').attr('id')
        let val = $(this).find('.option-val').val()

        if (item_amount > 0) {
          val *= item_amount
        }

        global_select_packet = $.grep(global_select_packet, function (value) {
          return value.key != id;
        });

        if (!is_active) {
          $(this).removeClass('item-active')
        } else {
          $(this).addClass('item-active')
          global_select_packet.push({
            key: id,
            price: val
          })
        }
        console.log(global_select_packet)

        //save packet data to local storeage
        localStorage.setItem('packet_data', JSON.stringify(global_select_packet))

        let before_count = $('#total').text()
        let total = sum_select_packet(global_select_packet)
        $('#total').text(total)

        //animate counter
        $('#total').each(function () {
          var $this = $(this);
          $({
            Counter: parseInt(before_count)
          }).animate({
            Counter: $this.text()
          }, {
            duration: 1500,
            easing: 'swing',
            step: function () {
              $this.text(Math.ceil(this.Counter));
            },
            complete: function () {
              $this.text(total)
            }
          });
        });

        // console.log(total);

      })


    }



    function sum_select_packet(obj) {
      sum = 0;
      $.each(obj, function (i, j) {
        // console.log(j)
        sum += parseInt(j.price);

      })

      $(document).prop('title', title + " ( cost total : " + sum + " )");



      return sum
    }







  })


  $(window).on('load', function () {
    //get save data from localstore
    let local_packet = localStorage.getItem('packet');


    if (local_packet != null) {
      $('#packet_section').find('#' + local_packet).prop('checked', true).click()
    }


  });



  function setPacket_from_Store() {
    let local_packet_data = JSON.parse(localStorage.getItem('packet_data'))
    // console.log(local_packet_data)
    if (local_packet_data != null) {
      $.each(local_packet_data, function (key, val) {
        // console.log(val.key)
        $('#' + val.key).click()
      })
    }


  }


})(window.jQuery);