"use strict";

(function ($) {

  $(document).ready(function () {
    var global_select_packet = [];
    var sum = 0;

    $.ajax({
      url: "/src/db/price.json",
      dataType: 'json',
      success: function success(jsonData) {

        var packet = jsonPath(jsonData, "$..packets");
        var packethtml = '';

        packet[0].forEach(function (res) {
          // console.log(res)
          packethtml += "          \n          <div class=\"form-check\">\n            <input class=\"packet form-check-input\" type=\"radio\" name=\"packet-item\" id=\"" + res.packet + "\" val=\"" + res.packet + "\">\n            <label class=\"form-check-label\" for=\"" + res.packet + "\">\n              " + res.label + "\n            </label>\n          </div>\n\n          ";
        });
        packethtml = "<ul>" + packethtml + "</ul>";

        $('#packet_section').html('').html(packethtml);

        $('.packet').click(function () {

          //reset total
          sum = 0;
          global_select_packet = [];

          var pk = $(this).attr('val');
          var packetData = jsonPath(jsonData, "$.." + pk);

          var packet_basic = jsonPath(packetData, "$..basic");
          var packet_ecomerce = jsonPath(packetData, "$..ecommerce");
          var packet_extra = jsonPath(packetData, "$..extra");
          var packet_server = jsonPath(packetData, "$..server");

          getOptionData(packet_basic, 'packet_option', 'Basic Option');
          getOptionData(packet_ecomerce, 'packet_ecommerce', 'Ecommerce Option');
          getOptionData(packet_extra, 'packet_extra', 'Extra Option');
          getOptionData(packet_server, 'packet_server', 'Server Option');
          selectEvent();
        });
      }
    });

    function getOptionData(data_list, el, title) {
      var html_skele = "<h3>" + title + "</h3>";
      $.each(data_list, function (i, obj) {

        $.each(obj, function (key, val) {
          // console.log(val.option_dynamic)
          var amount = '';
          if (val.option_dynamic == true) {
            amount = "\n            <div class=\"input-group-append\">\n            <input type=\"number\" class=\"form-control item-amount\" >\n           </div>            \n            ";
          }
          html_skele += "\n          <div class=\"input-group\">\n            <div class=\"option-item custom-control custom-checkbox\">\n              <input type=\"checkbox\" class=\"custom-control-input option-val\" id=\"" + val.option_key + "\" value=\"" + val.option_price + "\">\n              <label class=\"custom-control-label\" for=\"" + val.option_key + "\">" + val.option_label + " : " + val.option_price + "</label>\n              " + amount + "\n            </div> \n            \n          </div>         \n      ";
        });
      });

      $('#' + el).html('').html(html_skele + '<hr/>');

      amount_click();
    }

    function amount_click() {
      $('.item-amount').change(function () {
        // console.log($(this).val())
        $(this).parent().parent().find('.option-val').prop('checked', true);
      });
    }

    function selectEvent() {
      $('.option-item').on('change', function (event) {

        // console.log('change') 

        var is_active = $(this).find('.option-val').prop("checked");
        // console.log(is_active)
        var item_amount = $(this).find('.item-amount').val();
        // console.log('item_amount ' + item_amount)

        var id = $(this).find('.option-val').attr('id');
        var val = $(this).find('.option-val').val();

        if (item_amount > 0) {
          val *= item_amount;
        }

        global_select_packet = $.grep(global_select_packet, function (value) {
          return value.key != id;
        });

        if (!is_active) {
          $(this).removeClass('item-active');
        } else {
          $(this).addClass('item-active');
          global_select_packet.push({
            key: id,
            price: val
          });
        }
        // console.log(global_select_packet)
        var before_count = $('#total').text();
        var total = sum_select_packet(global_select_packet);
        $('#total').text(total);

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
            step: function step() {
              $this.text(Math.ceil(this.Counter));
            },
            complete: function complete() {
              $this.text(total);
            }
          });
        });

        // console.log(total);
      });
    }

    function sum_select_packet(obj) {
      sum = 0;
      $.each(obj, function (i, j) {
        // console.log(j)
        sum += parseInt(j.price);
      });
      return sum;
    }
  });
})(window.jQuery);