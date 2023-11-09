
$(function(){
    // Manipulate restaurant top
    $(".mb_top").on('change', function(e) {
        const id = e.target.id;
        const mb_top = e.target.checked ? 'Y' : 'N';
        
        axios.post("/resto/all-restaurants/update",{id: id, mb_top: mb_top})
        .then(response => {
            const result = response.data;
            if (result.state === 'success') alert ('Successfully updated!');
            else alert (result.message);

        })
        .catch(err => console.log(err));

    });

     // Manipulate Restaurant status 
     $(".mb_status").on('change', function(e) {
        const id = e.target.id;
        const mb_status = $(`#${id}.mb_status`).val();
        console.log("mb_status", mb_status)
        
        axios.post("/resto/all-restaurants/update",{id: id, mb_status: mb_status})
        .then(response => {
            const result = response.data;
            if (result.state === 'success') alert ('Successfully updated!');
            else alert (result.message);

        })
        .catch(err => console.log(err));

    });
});