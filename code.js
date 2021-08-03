class FlickGallery {
    constructor(location) {
        this.term = 'Dog'
        this.location = location
        this.container = document.getElementById('photoContainer')
        this.page = 1
        this.perPage = 3
        this.currentPhotoIndex = 0
        this.photos = []
        this.isLoading = false

        document.getElementById('next').addEventListener('click', this.displayNextPhoto.bind(this))
    }

    startSlideShow() {
        setInterval(this.displayNextPhoto.bind(this), 1000)
    }

    displayNextPhoto() {
        if (this.isLoading) {
            return;
        }

        // if the data is being loaded, disable the button
        console.log("will display next photo")
        this.currentPhotoIndex += 1

            if (this.currentPhotoIndex < this.photos.length) {
            let photoObject = this.photos[this.currentPhotoIndex]
            this.displayPhotoObject(photoObject)
         } else {
            console.log("fetching another page of photos from Flickr")
            this.page += 1
            this.currentPhotoIndex = 0
            this.fetchDataFromFlickr()
         }
    }
// displays photo to the page
    displayPhotoObject(photoObj) {
        let imageUrl = this.constructImageURL(photoObj);
        let img = document.createElement('img')
        img.src = imageUrl
        this.container.innerHTML = ''
        this.container.append(img)
    }
// begins to process of running through photos
    processFlickrResponse(parsedResponse) {
        this.setLoading(false)
        console.log(parsedResponse)
        this.photos = parsedResponse.photos.photo
            if (this.photos.length > 0) {
            let firstPhotoObject = this.photos[this.currentPhotoIndex]
            this.displayPhotoObject(firstPhotoObject)
          } else {
            this.container.innerHTML = 'No more pictures'
        }
    }
// text next to button
    setLoading(isLoading) {
        let loadingSpan = document.getElementById('loading')
            if (isLoading) {
                this.isLoading = true
                loadingSpan.innerHTML = 'Loading please wait'
            } else {
                this.isLoading = false
                loadingSpan.innerHTML = ''
         }

    }
// turn api data into readable text 
    fetchDataFromFlickr() {
        let url = this.generateApiUrl();
        let fetchPromise = fetch(url)
        this.setLoading(true)
        fetchPromise
            .then(response => response.json())
            .then(parsedResponse => this.processFlickrResponse(parsedResponse))
    }
// 
    generateApiUrl() {
        return 'https://shrouded-mountain-15003.herokuapp.com/https://flickr.com/services/rest/' +
            '?api_key=97022c3ec5d629b999b722e9bd140543' +
            '&format=json' +
            '&nojsoncallback=1' +
            '&method=flickr.photos.search' + 
            '&safe_search=1' +
            '&per_page=' + this.perPage +
            '&page=' + this.page +
            '&text=' + this.term +
            '&lat=' + this.location.latitude +
            '&lon=' + this.location.longitude;
    }
// generates image url for each indivisual photo
    constructImageURL(photoObj) {
        return "https://farm" + photoObj.farm +
                ".staticflickr.com/" + photoObj.server +
                "/" + photoObj.id + "_" + photoObj.secret + ".jpg";
    }
}

function onGeolocationSuccess(data) {
    let location = data.coords;
    let gallery = new FlickGallery(location)
        gallery.fetchDataFromFlickr() 
    
    const watchId = navigator.geolocation.watchPosition(position => {
    let location = position.coords;
        
             console.log("Latitude:   " + location.latitude)
             console.log("Longitude: " + location.longitude)
             console.log( "Watch Id:   " + watchId)
             
             
             //navigator.geolocation.clearWatch(watchId); 
      });
       
         gallery.fetchDataFromFlickr() 
       
}

function onGeolocationError() {
    const randomLocation =      
                // Paris // 
            { latitude: 48.8575, 
              longitude: 2.2982 } 
    console.log("Couldn't find your position..so" + 
    "Paris!: " + `${JSON.stringify(randomLocation)}`)
    }
let options = {
	enableHighAccuracy: true,
	maximumAge: 0
}

navigator.geolocation.getCurrentPosition(onGeolocationSuccess, onGeolocationError, options)