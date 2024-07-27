
$(function() {
    // Manipulate dealer top
    $(".mb_top").on('change', function(e) {
        const id = e.target.id;
        const mb_top = e.target.checked ? 'Y' : 'N';
        
        axios.post("/dealers/all-dealers/update",{id: id, mb_top: mb_top})
        .then(response => {
            const result = response.data;
            if (result.state === 'success') alert ('Successfully updated!');
            else alert (result.message);

        })
        .catch(err => console.log(err));

    });

    $(".hiding_btn").on("click",() =>{
        $(".car_container").slideToggle(500);
        $(".hiding_btn").css("display","none");
     });

     // Manipulate Dealers status 
     $(".mb_status").on('change', function(e) {
        const id = e.target.id;
        const mb_status = $(`#${id}.mb_status`).val();
        
        axios.post("/dealers/all-dealers/update",{id: id, mb_status: mb_status})
        .then(response => {
            const result = response.data;
            if (result.state === 'success') alert ('Successfully updated!');
            else alert (result.message);

        })
        .catch(err => console.log(err));

    });
});

//Event status changer
$(".new_product_status").on("change", async function(e){
    const id= e.target.id;
    const event_status = $(`#${id}.new_product_status`).val();
     try{
        const response = await axios.post(
            `/dealers/event/edit/${id}`,
            {id: id, event_status: event_status});
        const result = response.data;
        console.log("result:", result);

        if (result.state == 'success') {
            alert(`Event status is successfully changed to ${product_status}`);
            location.reload();
        } else {
            alert (result.message);
        }
     } catch (err) {
        console.log('updateChosenEvent err:', err);
     }

   })

   function validateForm() {
        const admin_mb_id = $(".dealers_mb_id").val(),
              event_name = $(".product_name").val(),
              event_type = $(".product_price").val(),
              event_status = $(".product_collection").val(), 
              event_description = $(".product_description").val()   
    
              if(admin_mb_id == '' || event_name == '' || event_type == '' || event_status == '' ||
              event_description == '' ) {
                alert ("Please fill all the fields");
                return false;
              } else return true;
    }

    function previewFileHandler(input, order) {
          const image_class_name = input.className;
          const file = $(`.${image_class_name}`).get(0).files[0],
              fileType= file['type'],
              validImageTypes= ['image/jpg','image/jpeg','image/png'];
      
              if (!validImageTypes.includes(fileType)) {
                  alert ('Please upload only allowed pictures (jpg,jpeg,png)');
              } else {
                  if(file) {
                      let reader = new FileReader();
                      reader.onload = function (){
                          $(`#image_section_${order}`).attr("src", reader.result); 
                      }
                      reader.readAsDataURL(file);
                  }
                }
              }

