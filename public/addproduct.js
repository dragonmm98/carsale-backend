$(function(){

 $(".hiding_btn").on("click",() =>{
    $(".car_container").slideToggle(500);
    $(".hiding_btn").css("display","none");
 })

 //Product status changer
 $(".new_product_status").on("change", async function(e){
      const id= e.target.id;
      const product_status = $(`#${id}.new_product_status`).val();
       try{
          const response = await axios.post(
              `/dealers/products/edit/${id}`,
              {id: id, product_status: product_status});
          const result = response.data;
          console.log("result:", result);
  
          if (result.state == 'success') {
              alert(`Product status is successfully changed to ${product_status}`);
              location.reload();
          } else {
              alert (result.message);
          }
       } catch (err) {
          console.log('updateChosenProduct err:', err);
       }
  
     })

});

function validateForm() {
        const dealers_mb_id = $(".dealers_mb_id").val(),
              product_name = $(".product_name").val(),
              product_price = $(".product_price").val(),
              product_company = $(".product_company").val(),
              product_collection = $(".product_collection").val(),
              product_status = $(".product_status").val(), 
              product_description = $(".product_description").val(),  
              product_milaege = $(".product_milaege").val(),  
              product_size = $(".product_size").val(),  
              product_fuel_type = $(".product_fuel_type").val(),
              product_year = $(".product_year").val(),
              product_color = $(".product_color").val()
    
              if(dealers_mb_id == '' || product_name == '' || product_price == '' || product_company == '' ||
              product_collection == '' || product_description =='' || product_milaege =='' || 
              product_size =='' || product_fuel_type =='' || product_year =='' || 
              product_color =='' || product_status == '') {
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

