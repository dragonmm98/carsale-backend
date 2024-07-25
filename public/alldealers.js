
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