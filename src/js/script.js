(function ($) {
  $(document).ready(function () {

   


    //social share
    $("#share").jsSocials({
      shares: ["email", "twitter", "facebook", "pinterest"]
    });

    // var title = $(document).prop("title");
    var global_select_packet = [];
    var sum = 0;

    $.ajax({
      url: "/src/db/price.json",
      dataType: "json",
      success: function (jsonData) {
        var packet = jsonPath(jsonData, "$..packets");
        var packethtml = "";

        packet[0].forEach((res) => {
          // console.log(res)
          packethtml += `    
          <div class="col s3 packets">
            <label class="card">                        
              <input class="packet card-content" name="packet-item" type="radio" id="${
                res.packet
              }" val="${res.packet}" />
              <span>${res.label}</span>               
            </label>   
    
          </div>
          `;
        });
        packethtml = `<div>${packethtml}</div>`;

        $("#packet_section")
          .html("")
          .html(packethtml);

        $(".packet").click(function () {
          setTimeout(() => {
            setPacket_from_Store();
            $('.packet').parent().removeClass('active')
            $(this).parent().addClass('active')


          }, 100);

          var pk = $(this).attr("val");
          //set packet local store

          localStorage.setItem("packet", pk);
          // console.log(pk)

          var packetData = jsonPath(jsonData, "$.." + pk);
          var packet_basic = jsonPath(packetData, "$..basic");
          var packet_ecomerce = jsonPath(packetData, "$..ecommerce");
          var packet_extra = jsonPath(packetData, "$..extra");
          var packet_server = jsonPath(packetData, "$..server");

          getOptionData(packet_basic, "packet_option", "Basic Option", "Lorem");

          getOptionData(packet_ecomerce, "packet_ecommerce", "Ecommerce Option");
          getOptionData(packet_extra, "packet_extra", "Extra Option");
          getOptionData(packet_server, "packet_server", "Server Option");
          selectEvent();
        });
      }
    });

    function getOptionData(data_list, el, title, desc) {
      if (!desc) {
        desc = ''
      }
      let html_skele = `<h5>${title}</h5><p>${desc}</p>`;
      var amount = "";
      var cal_class = "col s6";

      $.each(data_list, function (i, obj) {
        $.each(obj, function (key, val) {
          // console.log(val.option_dynamic)
          amount = ''
          if (val.option_dynamic == true) {
            amount = `<span class="range-field">
              <input type="range" class="item-amount " placeholder="Input page amount" step="5" min="5" max="50"  />  
              
            </span>`;
            cal_class = "col s12"

          } else {
            cal_class = "col s6";
          }
          html_skele += `          
            <div class="option-item ${cal_class}">              
              <label>
              <input type="checkbox" class="custom-control-input option-val" id="${
                val.option_key
              }" value="${val.option_price_start}" val-end="${val.option_price_end}">
              <span class="float-left item-title">${val.option_label}</span>
              ${amount} 
              </label>
          </div>`;
        });
      });

      $("#" + el)
        .html(" ")
        .html(html_skele);

      // set_range_slide()
      amount_click();

    }


    function amount_click() {
      $(".item-amount").change(function () {
        // console.log($(this).val())
        $(this)
          .parent()
          .parent()
          .find(".option-val")
          .prop("checked", true);
      });
    }

    function selectEvent() {
      $(".option-item").on("change", function (event) {
        let is_active = $(this)
          .find(".option-val")
          .prop("checked");
        // console.log(is_active)
        let item_amount = $(this)
          .find(".item-amount")
          .val();
        if (!item_amount) {
          item_amount = 1
        }
        // console.log('item_amount ' + item_amount)

        let id = $(this)
          .find(".option-val")
          .attr("id");
        let val_start = $(this)
          .find(".option-val")
          .val();
        let val_end = $(this)
          .find(".option-val")
          .attr('val-end');

        if (item_amount > 1) {
          val_start *= item_amount;
          val_end *= item_amount;
          $(this).find('.item-title-amount').remove()
          $(this).find('.item-title').append(`<span class="item-title-amount">${item_amount}</span>`)
        }

        global_select_packet = $.grep(global_select_packet, function (value) {
          return value.key != id;
        });

        if (!is_active) {
          $(this).removeClass("item-active");
        } else {
          $(this).addClass("item-active");
          global_select_packet.push({
            key: id,
            price_start: val_start,
            price_end: val_end,
            item_amount: item_amount
          });
        }

        show_result(global_select_packet)
        // console.log(global_select_packet);

        //save packet data to local storeage
        localStorage.setItem(
          "packet_data",
          JSON.stringify(global_select_packet)
        );

        $("#total span").each(function () {
          $this = $(this)
          let before_count = $this.text();
          let total = sum_select_packet(global_select_packet);
          // console.log(total)
          if ($this.hasClass('sum-start')) {
            total = total.start
          } else {
            total = total.end
          }
          var $el = $this;
          $({
            someValue: before_count
          }).animate({
            someValue: total
          }, {
            duration: 500,
            easing: 'swing',
            step: function () {
              $el.text(commaSeparateNumber(Math.round(this.someValue)));
            },
            complete: function () {

              $this.text(commaSeparateNumber(total));
            }
          })


        })


      });
    }



  });

  function sum_select_packet(obj) {
    // console.log(obj)
    let sum = []
    let start = 0
    let end = 0
    $.each(obj, function (i, j) {
      start += parseInt(j.price_start);
      end += parseInt(j.price_end);
    });
    sum.start = start
    sum.end = end
    return sum;
  }

  function commaSeparateNumber(val) {
    while (/(\d+)(\d{3})/.test(val.toString())) {
      val = val.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    }
    return val;
  }

  $(window).on("load", function () {
    //get save data from localstore
    let local_packet = localStorage.getItem("packet");

    if (local_packet != null) {
      $("#packet_section")
        .find("#" + local_packet)
        .prop("checked", true)
        .click();
    }
  });

  function setPacket_from_Store() {
    let local_packet_data = JSON.parse(localStorage.getItem("packet_data"));
    // console.log(local_packet_data)
    if (local_packet_data != null) {
      $.each(local_packet_data, function (key, val) {
        // console.log(val.key)
        $("#" + val.key).click();
      });
    }
  }

  function show_result(data) {
    data = data.sort()
    let result_html = ''
    let result_item_amount = ''
    $.each(data, function (i, j) {
      console.log(j)
      if (j.item_amount > 1) {
        result_item_amount = ` <div class="result_item_amount">X ${j.item_amount}</div>`
      } else {
        result_item_amount = ''
      }
      result_html += `
      
        <div class="row">
          <div class="col s6">
            <div class="result_name">${j.key}</div>
            ${result_item_amount}
          </div>
          <div class="col s6 right-align">${commaSeparateNumber(j.price_start)} ~ ${commaSeparateNumber(j.price_end)}</div>
        </div>
     
      `
    });

    $('#result').html(result_html);
    // console.log(data)

  }

  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyAf9Qmetk1pcnEoctwdNs1tfSfBB2cOLjs",
    authDomain: "webcal-824b7.firebaseapp.com",
    databaseURL: "https://webcal-824b7.firebaseio.com",
    projectId: "webcal-824b7",
    storageBucket: "webcal-824b7.appspot.com",
    messagingSenderId: "1024371885166",
    appId: "1:1024371885166:web:a6317657cf2207f2"
  };
  // Initialize Firebase
  let app = firebase.initializeApp(firebaseConfig);
  let db = app.firestore();
  // let booksRef = db.ref('books');

  $(".subscribe").click(function () {
    db.collection("calDB")
      .add({
        email: $("#email").val(),
        packet: localStorage.getItem("packet"),
        data: localStorage.getItem("packet_data"),
        date: new Date(),
        total: $("#total").text()
      })
      .then(function (docRef) {
        console.log("Document written with ID: ", docRef.id);
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
      });
  });
})(window.jQuery);