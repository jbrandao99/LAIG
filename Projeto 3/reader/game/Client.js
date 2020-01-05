/**
 * Client
 * @constructor
 */
class Client{
    constructor(port){
        this.requestPort = port || 8081;
    }

    /**
     * Makes a server request with a given string returning a Promise
     * @param {String} requestString
     */
    makeRequest(requestString){
        let requestPort = this.requestPort;
            var request = new XMLHttpRequest();
            request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);

            request.onload = function(data){
                if(this.status >= 200 && this.status < 300){
                    resolve(data.target.response);
                }
                else{
                    reject({
                        status: this.status,
                        statusText: request.statusText
                    });
                }
            };
            request.onerror = function(){
                reject({
                    status: this.status,
                    statusText: request.statusText
                });
            };

            request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            request.send();

    }
}
