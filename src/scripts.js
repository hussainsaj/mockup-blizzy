setInterval(() => {
    $(".cover-img").attr("src",`./media/cover-${Math.floor(1 + (Math.random() * 9))}.jpg`);
},5000)

let nav = true
const toggleNav = () => {
    const navValues = {
        true: {
            height: '100%'
        },
        false: {
            height: '0'
        }
    }

    $(`.sidemenu`).height(navValues[nav].height)

    nav = !nav
}

const changeContent = (toShow) => {
    $(`.content`).hide()
    $(`.cover`).hide()
    $(`.${toShow}`).show()


    nav = false
    toggleNav()

    $(`.sidemenu-link`).removeClass('greyed')
    $(`.sidemenu-${toShow}`).addClass('greyed')
    
    if (toShow === 'tour') {getEventDates()}
    else if (toShow === 'videos') {getVideos()}
    else if (toShow === 'photos') {getPhotos()}
}

const refreshContent = (html, type, className) => {
    $(`.${className}`).remove();
    $(`.${type}-header`).first().after(html)
}

const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);

    let dd = date.getDate();

    let mm = date.getMonth()+1; 

    let yyyy = date.getFullYear();

    if(dd < 10) {dd = '0' + dd}
    if(mm < 10) {mm = '0' + mm}

    return `${dd}/${mm}/${yyyy}`
}

const getEventDates = () => {
    const apiKey = apiKeys.ticketmaster
    const apiKeyword = 'G-Eazy'
    
    let html = ``

    $.ajax({
        type:"GET",
        url:`https://app.ticketmaster.com/discovery/v2/events?apikey=${apiKey}&keyword=${apiKeyword}`,
        async:true,
        dataType: "json",
        success: function(json) {
            if (!json._embedded || json._embedded.events.length === 0) {
                html = `<div class='events'>
                            <p class='greyed'>There are no upcoming tour dates.</p>
                        </div>`
            } else {
                json._embedded.events.map(result => {
                    /*let picture = `<picture>`
                    for (let i=0; i<result['images'].length - 1; i++) {
                            picture += `<source media='(max-width=${result['images'][i]['width']})' srcset='${result['images'][i]['url']}'>`
                    }
                    picture += `<img src='${result['images'][result['images'].length - 1]['url']}' alt='${result['name']}'></picture>`*/
                    let max = 0
                    let src = ''
                    for (let i=0; i<result['images'].length - 1; i++) {
                        if (result['images'][i]['width'] > max) {
                            src = result['images'][i]['url']
                            max = result['images'][i]['width']
                        }
                    }
                    let picture = `<picture><img src='${src}' alt='${result['name']}'></picture>`
                    html += `<div class='events'>
                                <a href='${result['url']}' target='_blank' rel='noopener'>
                                    ${picture}
                                    <div class='content-text'>
                                        <p>${result['name']}</p>
                                        <p class='greyed'>${formatDateTime(result["dates"]["start"]["localDate"])}</p>
                                        <p class='greyed'>${result._embedded["venues"][0]["name"]} - ${result._embedded["venues"][0]['city']['name']}, ${result._embedded["venues"][0]['country']['countryCode']}</p>
                                    </div>
                                </a>
                            </div>`
                })
            }
            refreshContent(html, 'tour', 'events')
        },
        error: function(xhr, status, err) {
            html = `<div class='events'>
                        <p class='greyed'>Error getting tour dates, please try again later.</p>
                    </div>`
            refreshContent(html, 'tour', 'events')
        }
    })
}

const getVideos = () => {
    const apiKey = apiKeys.youtube
    const channelID = 'UCrwFY34mhffjKubHKiaGrPw'

    let html = ''

    $.ajax({
        type:"GET",
        url:`https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelID}&part=snippet,id&order=date&maxResults=10`,
        async:true,
        dataType: "json",
        success: function(json) {
            json['items'].map(item => {
                html += `<div class='video'>
                            <iframe class="ytplayer" type="text/html" width="100%" src="https://www.youtube.com/embed/${item['id']['videoId']}" frameborder="0"></iframe>
                            <div class='content-text'>
                                <p>${item['snippet']['title']}</p>
                                <p class='greyed'>${formatDateTime(item['snippet']['publishTime'])}</p>
                                <p class='greyed'>${item['snippet']['description']}</p>
                            </div>
                        </div>`
            })
            refreshContent(html, 'videos', 'video')
        },
        error: function(xhr, status, err) {
            html = `<div class='video'>
                        <p class='greyed'>Error getting videos, please try again later.</p>
                    </div>`
            refreshContent(html, 'videos', 'video')
        }
    })
}

const getPhotos = () => {
    let html = ''

    $(`.photos`).empty()

    for (let i=1; i<=9; i++) {
        html += `<a onClick='openImage("${i}")'><picture><img src='./media/cover-${i}.jpg' class='photo' alt='blizzy performance image'></picture></a>`
    }

    $('.photos').append(html)
}

const openImage = (img) => {
    $(`.photos`).append(`
        <div class='image-full-view'>
            <picture><img src='./media/cover-${img}.jpg' class='photo' alt='blizzy performance background image'></picture>
            <div class='close-button'>
                <a onclick='closeImage()'>+</a>
            </div>
        </div>`
    )
}

const closeImage = () => {
    $('.image-full-view').remove()
}