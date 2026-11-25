//alert("Script file successfully accessed");

//Event listeners
let authorLinks = document.querySelectorAll("a");
for (let authorLink of authorLinks) {
    authorLink.addEventListener("click", getAuthorInfo);
}

//fetch to display author first/last and img when name clicked
async function getAuthorInfo() {
    const myModal = new bootstrap.Modal(document.getElementById('authorModal'));
    myModal.show();
    let url = `/api/author/${this.id}`;
    let response = await fetch(url);
    let data = await response.json();
    //console.log(data);
    let authorInfo = document.querySelector("#authorInfo");
    authorInfo.innerHTML = `<h1> ${data[0].firstName}
                                    ${data[0].lastName} </h1>`;
    authorInfo.innerHTML += `<img src="${data[0].portrait}"width="200"><br>`; //Albert Einstien's original photo link is broken.  I UPDATE'd link.
    authorInfo.innerHTML += `<h2> <strong>Date of Birth: </strong>${data[0].dob}<br>
                                  <strong>Date of Death: </strong>${data[0].dod}<br>
                                  <strong>Country of Origin: </strong>${data[0].country}<br>
                                  <strong>Sex: </strong>${data[0].sex}<br>
                                  <strong>Profession: </strong>${data[0].profession}<br>
                                  <strong>Bio: </strong>${data[0].biography}  </h2>`;
}