(function ($) {

  $(document).ready(function () {
    var global_select_packet = []
    $.ajax({
      url: "/assets/db/price.json",
      dataType: 'json',
      success: function (jsonData) {


        var packet = jsonPath(jsonData, "$..packets");
        var packethtml = ''
        var optionChoice = []
        packet[0].forEach(res => {
          // console.log(res)
          packethtml += `
          <li class="packet" val="${res.packet}"> ${res.label} </li>
          `
        });
        packethtml = `<ul>${packethtml}</ul>`;

        $('#packet_section').html('').html(packethtml)

        $('.packet').click(function () {
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

          html_skele += `
          <div class="option-item custom-control custom-checkbox">
            <input type="checkbox" class="custom-control-input" id="${key}" val="${val}">
            <label class="custom-control-label" for="${key}">${key} : ${val}</label>
          </div>          
      `
        });
      });


      $('#' + el).html('').html(html_skele + '<hr/>')



    }

    function selectEvent() {
      $('.option-item input').on('click', function (event) {
        let is_active = $(this).parent().hasClass('item-active')
        $(this).parent().addClass('item-active')
        let id = $(this).attr('id')
        let val = $(this).attr('val')


        if (is_active) {
          console.log('same');
          $(this).parent().removeClass('item-active')

        } else {
          global_select_packet.push({
            [id]: val
          })
        }

        // var a = $(this).find('.custom-control-label').text()

        console.log(global_select_packet)
      })


    }








  })

})(window.jQuery);