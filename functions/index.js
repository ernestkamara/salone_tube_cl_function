// functions/index.js
const admin = require('firebase-admin');
const functions = require('firebase-functions');

// lightweight JavaScript date library for parsing
const moment = require('moment');

// lightweight JavaScript date library for parsing
// create the serpwow object, passing in our API key
const SerpWow = require('google-search-results-serpwow');

const serviceAccount = require("./keys/admin.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://mediasalone.firebaseio.com"
});

// create the serpwow object, passing in our API key
const serpwow = new SerpWow('B8DA332F043A499291C27E13111E44C9');

const min_date = moment().subtract(1, 'days').format("MM/DD/YYYY");
const max_date = moment().format("MM/DD/YYYY");

// set up the search parameters
const params = {
    q: 'Sierra Leone',
    search_type: 'news',
    news_type: 'all',
    num: '50',
    time_period: 'custom',
    sort_by: 'date',
    time_period_min: min_date,
    time_period_max: max_date
};

exports.addArticles = functions.https.onRequest(async (req, res) => {    
    const db = admin.firestore();
    const articlesRef = db.collection('articles');
    console.log('Operation started')
    console.log('Params: ' + JSON.stringify(params));    
    await serpwow.json(params)
        .then(result => {
            const articles = result["news_results"]
            articles.forEach(article => {
                console.log('Adding: ' + article['date_utc'] + '-' + article['title']);
                const id = article['date_utc'] + article['position']
                var ref = articlesRef.doc(id);
                ref.set(article)
                    .catch(error => {
                        console.log(error);
                    })
            });
            const firstArticle = articles[0]
            const counts = articles.length
            const id = firstArticle['date_utc'] + counts
            const notificationsRef = db.collection('notifications').doc(id);
            notificationsRef.set({
                "date": firstArticle['date_utc'],
                "title": firstArticle['title'],
                "counts": counts,
                "thumbnail": firstArticle['thumbnail'],
                "snippet": firstArticle['snippet']
            })
            res.status(200).send('Operation completed for addArticlesOnFreetown')
            console.log('Operation Completed for addArticlesOnFreetown')
            return null;
        })
        .catch(error => {
            console.log(error);
            res.status(500).send('Operation failed for addArticlesOnFreetown')
            return null;
        });
});

exports.scheduledFunction = functions.pubsub.schedule('every 12 hours').onRun(async (context) => {
    console.log('Initialising...')
    console.log('Params: ' + JSON.stringify(params));   
    const db = admin.firestore();
    const articlesRef = db.collection('articles');
    await serpwow.json(params)
        .then(result => {
            const articles = result["news_results"]
            console.log('Parsing items from API...' + articles.length)
            articles.forEach(article => {
                console.log('Adding: ' + article['date_utc'] + '-' + article['title']);
                const id = article['date_utc'] + article['position']
                var ref = articlesRef.doc(id);
                ref.set(article)
                    .catch(error => {
                        console.log(error);
                    })
            });
            const firstArticle = articles[0]
            const counts = articles.length
            const id = firstArticle['date_utc'] + counts
            const notificationsRef = db.collection('notifications').doc(id);
            notificationsRef.set({
                "date": firstArticle['date_utc'],
                "title": firstArticle['title'],
                "counts": counts,
                "thumbnail": firstArticle['thumbnail'],
                "snippet": firstArticle['snippet']
            })
            res.status(200).send('Operation completed')
            console.log('Finishing...')
            return null;
        })
        .catch(error => {
            console.log(error);
            res.status(500).send('Operation failed')
            return null;
        });
    return null;
})
