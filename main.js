const randomAPI = 'https://api.thecatapi.com/v1/images/search?limit=3';
const favoritesAPI = 'https://api.thecatapi.com/v1/favourites';
const deleteFavoritesAPI = (id) => `https://api.thecatapi.com/v1/favourites/${id}`;
const uploadAPI = 'https://api.thecatapi.com/v1/images/upload';

const spanError = document.getElementById('error');

async function randomFetch () { 
    const response = await fetch(randomAPI);
    const data = await response.json();
    
    console.log('random');
    console.log(data);

    if (response.status !== 200) {
        spanError.innerHTML = `There was a mistake: ${response.status}`;
    } else {
        const img1 = document.getElementById('img1');
        const img2 = document.getElementById('img2');
        const img3 = document.getElementById('img3');
        const btn1 = document.getElementById('btn1');
        const btn2 = document.getElementById('btn2');
        const btn3 = document.getElementById('btn3');
    
    
        img1.src = data[0].url;
        img2.src = data[1].url;
        img3.src = data[2].url;

        btn1.onclick = () => saveFavorites(data[0].id);
        btn2.onclick = () => saveFavorites(data[1].id);
        btn3.onclick = () => saveFavorites(data[2].id);
    }
}

async function favoriteFetch () { 
    const response = await fetch(favoritesAPI, {
        method: 'GET',
        headers: {
            'X-API-KEY': 'live_bWLdVBxJIhsutemvQqkUA9dlTgzXHhUggO4Q7THe8shsE2cJQQYYIj9xpYWAyKMH'
        }
    });
    const data = await response.json();
    
    console.log('favorites');
    console.log(data);

    const sectionDiv = document.getElementById('favoritesMichisDiv');
    sectionDiv.innerHTML = '';

    if (response.status !== 200) {
        spanError.innerHTML = `There was a mistake: ${response.status} data.message`;
    } else {
        data.forEach(michi => {
            const article = document.createElement('article');
            const img = document.createElement('img');
            const btn = document.createElement('button');
            const btnText = document.createTextNode('Remove from favorites');

            img.src = michi.image.url;
            btn.appendChild(btnText);
            btn.onclick = () => deleteFavorites(michi.id);
            article.appendChild(img);
            article.appendChild(btn);
            sectionDiv.appendChild(article);

        });
    }
}

async function saveFavorites (id) {
    const response = await fetch(favoritesAPI, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': 'live_bWLdVBxJIhsutemvQqkUA9dlTgzXHhUggO4Q7THe8shsE2cJQQYYIj9xpYWAyKMH'
        },
        body: JSON.stringify({
            'image_id': id
        })
    })

    if (response.status !== 200) {
        spanError.innerHTML = `There was a mistake: ${response.status} data.message`;
    }

    favoriteFetch();
}

async function deleteFavorites(id) {
    const response = await fetch(deleteFavoritesAPI(id), {
        method: 'DELETE',
        headers: {
            'X-API-KEY': 'live_bWLdVBxJIhsutemvQqkUA9dlTgzXHhUggO4Q7THe8shsE2cJQQYYIj9xpYWAyKMH'
        }
    })

    if (response.status !== 200) {
        spanError.innerHTML = `There was a mistake: ${response.status} data.message`;
    }

    favoriteFetch();
}

async function uploadMichi() {
    const form = document.getElementById('uploadingForm');
    const formData = new FormData(form);

    console.log('formDAta');
    console.log(formData.get('file'));

    const response = await fetch(uploadAPI, {
        method: 'POST',
        headers: {
            'X-API-KEY': 'live_bWLdVBxJIhsutemvQqkUA9dlTgzXHhUggO4Q7THe8shsE2cJQQYYIj9xpYWAyKMH'
        },
        body: formData,
    })

    const data = await response.json();

    if (response.status !== 201) {
        spanError.innerHTML = `There was a mistake: ${response.status}`;
    } else {
        console.log(data.url);
        console.log(data);
        saveFavorites(data.id)
    }
}

randomFetch();
favoriteFetch();