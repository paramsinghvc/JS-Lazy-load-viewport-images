document.addEventListener('DOMContentLoaded', function() {
    var $imagesHolder = document.getElementById('imagesHolder');
    var $images = $imagesHolder.querySelectorAll('img[data-src]');
    var $progressBar = document.getElementById('progress-bar');

    function scrollHandler(e) {
        var $imgHolderTop = $imagesHolder.getBoundingClientRect().top;

        // Checking if the images holder panel has snuck into the viewport and trigger the lazy image loading accordingly
        // and remove the scroll event handler from the body.

        if ($imgHolderTop <= document.documentElement.clientHeight) {
            document.removeEventListener('scroll', scrollHandler);

            loadImages($images);

            console.info('%cHit Rock Bottom, Images tryna peek into the viewport', 'color: green; font-size: x-small');
            console.info('%cCleaning up, removing the scroll event handler', 'color: orange; font-size: x-small');
        }
    }

    document.addEventListener('scroll', scrollHandler);

    function createImage(i) {
        return new Promise(function(resolve, reject) {
            let img = new Image;
            img.onload = function() {
                resolve(i);
            }
            img.onerror = function(err) {
                reject(err);
            }
            img.src = i.getAttribute('data-src');
        });
    }

    function updateProgressBar(val) {
    	console.log(val);
        if (val === 100) {
            $progressBar.style.display = 'none';
            return;
        }
        $progressBar.style.width = val + '%';
    }

    function evalPercentageAndUpdateProgressbar(imagesLoaded, totalImages) {
        updateProgressBar((imagesLoaded / totalImages) * 100);
    }

    function loadImages($images) {
        var seq = Promise.resolve();
        $imagesArr = Array.prototype.slice.call($images);

        var totalImages = $imagesArr.length;
        var imagesLoaded = 0;

        $promiseArr = $imagesArr.map(function(i) {
            return createImage(i);
        })

        $promiseArr.forEach(function(p) {
            seq = seq.then(function() {
                return p.then(function(img) {
                    console.log(img.getAttribute('data-key'));
                    img.src = img.getAttribute('data-src');
                    evalPercentageAndUpdateProgressbar(++imagesLoaded, totalImages);
                })
            })
        })

        seq.then(function() {
            console.log('All Done');
        })
    }

})
