const base_url = "https://aqueous-woodland-96253.herokuapp.com/";
// articles

let status = (response) => {
    if(response.status !== 200) {
        console.log("Error : " + response.status);
        return Promise.reject(new Error(response.statusText));
    } else {
        return Promise.resolve(response);
    }
}

// Blok kode untuk memparsing json menjadi array JavaScript
let json = (response) => {
    return response.json();
}

// Blok kode untuk meng-handle kesalahan di blok catch
let error = (error) => {
    console.log("Error : " + error);
}

// Blok kode untuk melakukan request data json
let getArticles = () => {
    if ('caches' in window) {
        caches.match(`${base_url}articles`).then((response) => {
            if (response) {
                response.json().then((data) => {
                    var articlesHTML = "";
                    data.result.forEach((article) => {
                        articlesHTML += `
                            <div class="card">
                                <a href="./article.html?id=${article.id}">
                                <div class="card-image waves-effect waves-block waves-light">
                                    <img src="${article.thumbnail}" />
                                </div>
                                </a>
                                <div class="card-content">
                                <span class="card-title truncate">${article.title}</span>
                                <p>${article.description}</p>
                                </div>
                            </div>
                            `;
                    });
                    // Sisipkan komponen card ke dalam elemen dengan id #content
                    document.getElementById("articles").innerHTML = articlesHTML;
                })
            }
        })
    }

    fetch(`${base_url}articles`)
    .then(status)
    .then(json)
    .then((data) => {
        // Objek/array JavaScript dari response.json() masuk lewat data.
        // Menyusun komponen card artikel secara dinamis

        let articlesHTML = "";
        data.result.forEach((article) => {
            articlesHTML += `
                <div class="card">
                    <a href="./article.html?id=${article.id}">
                        <div class="card-image waves-effect waves-block waves-light">
                            <img src="${article.thumbnail}" />
                        </div>
                    </a>
                    <div class="card-content">
                        <span class="card-title truncate">${article.title}</span>
                        <p>${article.description}</p>
                    </div>
                </div>
            `;
        });
        // Sisipkan komponen card ke dalam elemen dengan id #content
        document.getElementById("articles").innerHTML = articlesHTML;
    })
    .catch(error);
}

let getArticleById = () => {
    // Ambil nilai query parameter (?id=)
    var urlParams = new URLSearchParams(window.location.search);
    var idParam = urlParams.get("id");

    fetch(`${base_url}article/${idParam}`)
    .then(status)
    .then(json)
    .then((data) => {
        // Objek JavaScript dari response.json() masuk lewat variabel data.
        console.log(data);
        // Menyusun komponen card artikel secara dinamis
        var articleHTML = `
          <div class="card">
            <div class="card-image waves-effect waves-block waves-light">
              <img src="${data.result.cover}" />
            </div>
            <div class="card-content">
              <span class="card-title">${data.result.post_title}</span>
              ${snarkdown(data.result.post_content)}
            </div>
          </div>
        `;
        // Sisipkan komponen card ke dalam elemen dengan id #content
        document.getElementById("body-content").innerHTML = articleHTML;
    });
}