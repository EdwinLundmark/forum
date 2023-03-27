const images = document.querySelectorAll('.postImage');

images.forEach(image => {
    image.textContent = image.textContent.trim();
    if (image.textContent === "") return;
    fetch(`/images/${image.textContent}`, {
        method: 'POST'
    })
        .then(response => response.blob())
        .then(blob => {
            const imgUrl = URL.createObjectURL(blob);
            const img = document.createElement('img');
            img.src = imgUrl;
            image.append(img);
        })
    image.textContent = "";
});

function submitForm(event) {
    event.preventDefault(); // prevent default form submission
    const form = document.querySelector('.submitPost');
    const formData = new FormData(form);
    const data = {};
    let fileExt;

    formData.forEach((value, key) => {
        if (key === "image") {
            fileExt = value.name.split(".")[1];
            return;
        }
        data[key] = value
    });

    const imageFile = formData.get('image');
    const reader = new FileReader();
    reader.readAsDataURL(imageFile);

    if (imageFile.name === "") {
        const json = JSON.stringify(data);

        fetch('/submit-post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: json
        })
            .then(response => {
                form.reset();
                window.location.replace('/');
            })
            .catch(error => {
                console.error(error);
            });
    }
    else {

        reader.onload = () => {
            const base64String = reader.result.split(',')[1];
            data['image'] = base64String;
            data['imageName'] = base64String.slice(-20).replace(/[\+\/\=]/g, "X") + "." + fileExt;
            const json = JSON.stringify(data);

            fetch('/submit-post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: json
            })
                .then(response => {
                    form.reset();
                    window.location.replace('/');
                })
                .catch(error => {
                    console.error(error);
                });
        };
    }

}

function submitComment(event, id) {
    event.preventDefault(); // prevent default form submission
    const forms = document.querySelectorAll('.submitComment');

    let visibleForm;
    let formIndex = 0;

    for (let i = 0; i < forms.length; i++) {
        if (window.getComputedStyle(forms[i]).display !== 'none') {
            visibleForm = forms[i];
            formIndex = i;
            break;
        }
    }

    const formData = new FormData(visibleForm);
    const data = {};
    let fileExt;

    formData.forEach((value, key) => {
        if (key === "image") {
            fileExt = value.name.split(".")[1];
            return;
        }
        data[key] = value
    });

    data['postID'] = id;

    const imageFile = formData.get('image');
    const reader = new FileReader();
    reader.readAsDataURL(imageFile);

    if (imageFile.name === "") {
        const json = JSON.stringify(data);

        fetch('/submit-post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: json
        })
            .then(response => {
                visibleForm.reset();
                window.location.replace('/');
            })
            .catch(error => {
                console.error(error);
            });
    }
    else {

        reader.onload = () => {
            const base64String = reader.result.split(',')[1];
            data['image'] = base64String;
            data['imageName'] = base64String.slice(-20).replace(/[\+\/\=]/g, "X") + "." + fileExt;
            const json = JSON.stringify(data);

            fetch('/submit-post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: json
            })
                .then(response => {
                    visibleForm.reset();
                    window.location.replace('/');
                })
                .catch(error => {
                    console.error(error);
                });
        };
    }

}


function unhideReply(i) {
    const replies = document.querySelectorAll('.submitComment');
    const reply = replies[i];

    console.log(reply.style.display)

    if (reply.style.display === "none" || reply.style.display === "") reply.style.display = "block";

    else reply.style.display = "none";
}
