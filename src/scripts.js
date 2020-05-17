setInterval(() => {
    document.getElementsByClassName('cover-img')[0].src = './media/cover-' + Math.floor(1 + (Math.random() * 9)) + '.jpg'
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
    document.getElementsByClassName('sidemenu')[0].style.height = navValues[nav].height

    nav = !nav
}

const changeContent = (toShow) => {
    const content = document.getElementsByClassName('content')
    for (let i=0; i<content.length; i++) {
        content[i].style.display = 'none'
    }
    document.getElementsByClassName(toShow)[0].style.display = 'block'
    nav = false
    toggleNav()
    
    if (toShow === 'tour') {getEventDates()}
    else if (toShow === 'videos') {getVideos()}
}

const refreshContent = (html, type, className) => {
    $(`.${className}`).remove();
    $(`.${type}-header`).first().after(html)
}

const formatDateTime = (dateTime) => {

}

const getEventDates = () => {
    const apiKey = apiKeys.ticketmaster
    const apiKeyword = 'Halsey' //G-Eazy
    
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
                                        <p class='greyed'>${result["dates"]["start"]["localDate"]}</p>
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
                                <p class='greyed'>${item['snippet']['publishTime']}</p>
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