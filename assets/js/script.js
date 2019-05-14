(function ($) {

  $(document).ready(function () {
    var global_select_packet = []
    var sum = 0

    $.ajax({
      url: "/assets/db/price.json",
      dataType: 'json',
      success: function (jsonData) {

        var packet = jsonPath(jsonData, "$..packets");
        var packethtml = ''

        packet[0].forEach(res => {
          // console.log(res)
          packethtml += `          
          <div class="form-check">
            <input class="packet form-check-input" type="radio" name="packet-item" id="${res.packet}" val="${res.packet}">
            <label class="form-check-label" for="${res.packet}">
              ${res.label}
            </label>
          </div>

          `
        });
        packethtml = `<ul>${packethtml}</ul>`;

        $('#packet_section').html('').html(packethtml)

        $('.packet').click(function () {

          //reset total
          sum = 0
          global_select_packet = []

          var pk = $(this).attr('val')
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
      let html_skele = `<h2>${title}</h2>`;
      $.each(data_list, function (i, obj) {

        $.each(obj, function (key, val) {
          // console.log(val.option_dynamic)
          var amount = ''
          if (val.option_dynamic == true) {
            amount = `
            <div class="input-group-append">
            <input type="number" class="form-control item-amount" >
           </div>            
            `
          }
          html_skele += `
          <div class="input-group">
            <div class="option-item custom-control custom-checkbox">
              <input type="checkbox" class="custom-control-input option-val" id="${val.option_key}" value="${val.option_price}">
              <label class="custom-control-label" for="${val.option_key}">${val.option_label} : ${val.option_price}</label>
              ${amount}
            </div> 
            
          </div>         
      `
        });
      });

      $('#' + el).html('').html(html_skele + '<hr/>')

    }

    function selectEvent() {
      $('.option-item').on('change', function (event) {

        // console.log('change') 

        let is_active = $(this).find('.option-val').prop("checked");
        console.log(is_active)
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
        let total = sum_select_packet(global_select_packet)
        $('#total').text(total)
        // console.log(total);

      })


    }

    function sum_select_packet(obj) {
      sum = 0;
      $.each(obj, function (i, j) {
        // console.log(j)
        sum += parseInt(j.price);

      })
      return sum
    }







  })

})(window.jQuery);