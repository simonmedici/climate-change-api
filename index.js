const PORT = process.env.PORT || 8000 // this is for deploying on heroku
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const { response } = require('express')

const app = express()

const newspapers = [
    {
        name: 'tagesschau',
        address: 'https://www.tagesschau.de/thema/klimawandel/',
        base: '',
        country: 'deutschland'
    },
    {
        name: 'sueddeutsche',
        address: 'https://www.sueddeutsche.de/thema/Klimawandel',
        base: '',
        country: 'deutschland'
    },
    {
        name: 'deutschlandrundfunk',
        address: 'https://www.deutschlandfunk.de/berichterstattung-ueber-klimawandel-journalismus-oder-100.html',
        base: '',
        country: 'deutschland'
    },
    {
        name: 'welt.de',
        address: 'https://www.welt.de/themen/klimawandel/',
        base: 'welt.de',
        country: 'deutschland'
    },
    {
        name: 'wienerzeitung',
        address: 'https://www.wienerzeitung.at/dossiers/klimawandel/',
        base: '',
        country: 'österreich'
    },
    {
        name: 'frankfurter allgemeine',
        address: 'https://www.faz.net/aktuell/wissen/thema/klimawandel',
        base:'',
        country: 'deutschland'
    },
    {
        name: 'taz',
        address: 'https://taz.de/Schwerpunkt-Klimawandel/!t5008262/',
        base:'',
        country: 'deutschland'
    },
    {
        name: 'westdeutsche allgemeine',
        address: 'https://www.waz.de/thema/klimawandel/',
        base:'',
        country: 'deutschland'
    },
    {
        name: 'neu zürcher zeitung',
        address: 'https://www.nzz.ch/themen/klimawandel',
        base:'',
        country: 'schweiz'
    },
    {
        name: 'tages anzeiger',
        address: 'https://www.tagesanzeiger.ch/wissen/klimawandel',
        base:'',
        country: 'schweiz'
    },
    {
        name: 'der bund',
        address: 'https://www.derbund.ch/tags/68358/klimawandel',
        base:'',
        country: 'schweiz'
    },
    {
        name: 'zürichsee zeitung',
        address: 'https://www.zsz.ch/tags/68358/klimawandel',
        base:'',
        country: 'schweiz'
    },
    {
        name: 'heute',
        address: 'https://www.heute.at/klimaschutz',
        base:'',
        country: 'österreich'
    },
    {
        name: 'krone',
        address: 'https://www.krone.at/themen/klimawandel',
        base:'',
        country: 'österreich'
    },
    {
        name: 'oe24',
        address: 'https://www.oe24.at/themen/klima/klimawandel/135773323',
        base:'',
        country: 'österreich'
    }
]

const articles = []

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)


            $('a:contains("Klima")', html).each(function () {
                const title = $(this).text()
                const regexTitle = title.replace(/^[\D]&&\n|\s\s+/g, '')
                const url = $(this).attr('href')

                articles.push({
                    regexTitle,
                    url: newspaper.base + url,
                    source: newspaper.name,
                    country: newspaper.country
                })
            })
        })
})  

app.get('/', (reg, res) => {
    res.json('Willkommen zu dem Klimawandel-Nachrichten API')
})

app.get('/news', (req, res) => {
    res.json(articles)
})

app.get('/news/:newspaperId', (req, res) => {
    const newspaperId = req.params.newspaperId

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base

    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("Klima")', html).each(function () {
                const title = $(this).text()
                const regexTitle = title.replace(/^[\D]&&\n|\s\s+/g, '')
                const url = $(this).attr('href')

                specificArticles.push({
                    regexTitle,
                    url: newspaperBase + url,
                    source: newspaperId,
                    country: newspapers.country
                })
            })
            res.json(specificArticles)
        }).catch(err => console.log(err))

})


app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))