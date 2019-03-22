/* eslint-disable no-console */
import index from "./index.json";
import store from "./store.json";
import lunr from "lunr";

export default class SearchEngine {
    static idx;
    static store;

    static init() {
        console.log('loading indexing...');
        this.idx = lunr.Index.load(index);
        console.log('loading store...');
        this.store = store;
        console.log('loaded!');
    }

    static search(query) {
        var results = {
            twitts: [],
            time: "",
        };

        var start = new Date()
        this.idx.search(query).forEach(index => {
            //console.log(index);
            var positions = [];
            Object.keys(index.matchData.metadata).forEach(key => {
                index.matchData.metadata[key].body.position.forEach(position => {
                    positions.push(position)  
                });
            });
            positions.sort((a,b) => a[0]-b[0]);
            results.twitts.push({
                ...this.store[index.ref],
                positions: positions,
                score: index.score,
            })
        });      
        var time = new Date() - start
        results.time = time;
        console.log('Found ' + results.twitts.length + ' results in ' + time + ' Miliseconds');      
        return results;
    }
}
