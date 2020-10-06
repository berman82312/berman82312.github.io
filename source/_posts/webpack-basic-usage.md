---
title: Webpack Basic Usage
date: 2017-05-04 23:22:09
tags: webpack
---

( 2017-05-03 寫作當下使用的是 webpack 2.3.3)

Webpack 是個神奇且好用的東西，但 webpack2 的 document 目前不盡完善，有許多狀況與細節並沒有解釋或解釋詳盡。在這裡簡單的介紹使用 Webpack 完成 Code splitting ，以及使用 Chunkhash 達成解決 File Caching 的過程。

## 打包 (Bundle)
打包是最基本的 Webpack 功能，假設我們有個檔案叫`index.js`，裡面長得像是

``` javascript
'use strict';
var axios = require('axios');

(function(){
...
```

那麼，基本的`webpack.config.js`大概定義如下

``` javascript
'use strict';
var webpack = require('webpack');
var path = require('path');

var config = {
    entry: {
        app: './src/index.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    }
}

module.exports = config;
```
當我們執行`webpack --config webpack.config.js`之後，webpack 大概做了以下的事情：

1. 根據`entry`的定義，知道要打包一個叫做`app`的檔案，從`./src/index.js`作為起始文件，開始讀取檔案
2. `index.js`裡面`require('axios')`，因此在執行環境中尋找`axios`插件，一般會從`entry`的相對路徑以及`node_modules`裡面找。
3. 把`index.js`和`axios`打包成一份檔案輸出為`app.js`，`output`的`[name].js`就是指檔案名稱用`entry`所指定的，然後檔案放置的位置以`path`指定。其中`__dirname`是指執行`webpack`指令的根目錄

也就是說，我們開發可以結構化地把檔案分拆，像一般寫程式那樣。但我們不需要在 template 中用許多個`<script>`將所有`js`檔案載入，並還要注意先後順序。執行完`webpack`之後，只需要載入`app.js`就可以了。

### 多個檔案打包成一個
``` javascript
'use strict';
var webpack = require('webpack');
var path = require('path');

var config = {
    entry: {
        app: ['./src/index.js', './src/auth.js', './src/message.js']
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    }
}

module.exports = config;
```
webpack 會按照陣列的順序，一一打包檔案，然後整合為一包`app.js`

### 打包成多個檔案
``` javascript
'use strict';
var webpack = require('webpack');
var path = require('path');

var config = {
    entry: {
        app: './src/index.js',
        auth: ['./src/auth.js', './src/user.js'],
        message: './src/message.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    }
}

module.exports = config;
```
這樣設定的話，webpack 最終就會打包出三個檔案，分別是`app.js`,`auth.js`,`message.js`

## 拆分 (Code Splitting)
每次執行`webpack`，webpack就會幫我們將檔案重新打包、更新。但隨著架構愈來愈大時，我們自己的檔案、使用的第三方套件增多，我們打包出來的檔案也會愈來愈肥。這對頁面載入將是個很大的負荷。有時候我們可能只是改個一兩行，但整個`app.js`就會需要更新，使用者端就需要重新載入新的一整大包。

但其實第三方套件並不像我們自己的 Code 那麼經常變動，通常是我們自己想升版才會更動。而且寫`js`我們會使用的第三方套件通常挺多。如果能將這些部分與我們自己的 Code 分開打包成不同的一包，在我們更新自己的 Code 的時候，只會更新我們 Code 整合的那包，不會更動到第三方套件的那一包，可以減少一定程度的 Loading 負荷。

首先我們將`webpack.config.js`中的 `config` 更新成

``` javascript
var config = {
    entry: {
        app: './src/index.js',
        vendor: 'axios'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    }
}
```
執行`webpack`，`axios`這個第三方套件的會被打包進`vendor.js`，但我們會發現`app.js`裡面還是有`axios`，這是因為不同的`entry`，webpack 會分開打包，各自的 dependencies 各自處理。

為了讓共同的第三方套件都打包成同一包，我們將`webpack.config.js`更改為

``` javascript
var config = {
    entry: {
        app: './src/index.js',
        vendor: 'axios'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor'
        })
    ]
}
```
`CommonsChunkPlugin`會將各個`entry`中共同的套件包裝到指定的`name`檔案。所以當我們執行`webpack`之後，我們會發現這次`axios`只出現在`vendor.js`了。

我們可以進一步將`webpack.config.js`再改為

``` javascript
var config = {
    entry: {
        app: './src/index.js',
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: function (module) {
                // this assumes your vendor imports exist in the node_modules 
                return module.context && module.context.indexOf('node_modules') !== -1;
            }
        })
    ]
}
```
其中`minChunks`是指定判定套件為共同套件的條件，將其打包進指定檔案中。若是將`minChunks`指定為 `2`，那麼就是說在各`entry`中，總共出現`2`次以上的套件就將其打包進`vendor.js`這的檔案。而我們在這邊寫的 callback，是判斷套件若是有出現在`node_modules`中的，就視為共同套件打包進`vendor.js`中。

值得特別注意的是在這次的`webpack.config.js`中，我們的`entry`沒有指定`vendor`，僅僅靠`CommonsChunkPlugin`完成第三方套件的打包。這在 webpack 稱為 Implicit Common Vendor Chunk。


## 版本 (Chunkhash)
瀏覽器多有 Cache 的機制，static file (image, css, js...etc)會留有一份快取在 client 端。在一定時間內，若是瀏覽器發現這網站要求`app.js`，而`app.js`在本地端有一份 copy ，那瀏覽器會使用本地的`app.js` copy。這個機制是為了優化網頁的讀取，但卻造成了一個麻煩的情況。當我們更新了`app.js`，但因為檔名沒變，瀏覽器不會知道檔案內容改變了，會繼續使用本地端較舊的 copy 版本。

為了解決這個問題，通常的辦法是在檔案名稱加上版本號：`app.v1.js`。當我們更新`app.js`時，就更新版本號：`app.v2.js`，讓瀏覽器認為是要求一份不同的 js ，達到即時更新的效果。

身為一位工程師，改 code 才是我們的本職。需要在每次改 code 之後去注意版本號、手動更新，是一件麻煩且浪費我們腦內記憶體的事情。透過 webpack ，我們可以輕鬆達成這件事。

將`webpack.config.js`中的`output`改為

``` javascript
output: {
    filename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, 'dist')
...
}
```
webpack 打包檔案之後，會在檔案名自動添上一個`chunkhash`，所以我們會得到一個像是`app.3c75dbb16437c09415ac.js`的檔案名稱。每次更改 code，重新打包，webpack 就會產生一個新的 `chunkhash`，也就達成了更改版本的效果。

每個打包出的檔案的`chunkhash`都是 unique 的，這在打包成不同檔案的時候，可以幫助我們達到一個目的：更新`app.js`時，若`vendor.js`不需要更新，他可以維持舊的`chunkhash`，進而達到讓瀏覽器「只更新需要更新的套件」這件事。

但實際執行`webpack`後，我們會發現當我們更改了一小段`index.js`的 code，產出的 `app.[chunkhash].js` 和 `vendor.[chunkhash].js` 的`[chunkhash]`部分都更新了，並沒有達到預期的只更新`app.js`的效果。

這是因為每次 webpack 在執行打包時，會將一些 runtime code 帶進打包出的 Common Chunk 之中，也就是我們的 `vendor.js`，來幫助打包後的檔案處理引入插件。為了解決這個問題，我們再引入一個叫做 `manifest` 的檔案來處理這個問題。

### manifest
``` javascript
var config = {
    entry: {
        app: '/src/index.js'
    },
    output: {
        filename: '[name].[chunkhash].js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
       new webpack.optimize.CommonsChunkPlugin({
           name: 'vendor',
           minChunks: function (module) {
               return module.context && module.context.indexOf('node_modules') !== -1;
           }
       }),
       // extract all common modules from vendor and app bundles
       new webpack.optimize.CommonsChunkPlugin({ 
           name: 'manifest'
       })
    ]
}
```
這樣的設定下，首先 webpack 會把屬於 `node_modules` 中的第三方套件通通打包進 `vendor`，然後再把 `app` 和 `vendor` 共同的 `modules` 打包進 `manifest`。但因為 `vendor` 和 `app` 並沒有共同套件了，所以 `manifest` 最後只剩下 runtime code。

之後 html 只要按順序把 `manifest.[chunkhash].js`, `vendor.[chunkhash].js` 和 `app.[chunkhash].js`載入，就可以讓我們的 scripts 動起來了。雖然這樣我們多載入了一個檔案，但少變動 `vendor` 所省下的 loading 總的來說還是有益的。

## HTML template
一切都已逼近完美，只差當每次執行完`webpack`，我們就要更新一次我們的 template，把新的`<script>`部分的檔案名中的`chunkhash`更新。官方的教學是透過`ChunkManifestPlugin`產出一個`manifest.json`，會帶有檔案對應的資訊，然後把它直接在 template inline 引入。這種人工的作法實在令人覺得功虧一簣。另外還有一種方法是透過`HtmlWebpackPlugin`幫我們產生一個帶有`chunkhash`版本號的`<script>`的 html template。但使用方式略複雜，而且對於 template 有需多限制，若要客製化還要再學習許多插件。

基於我們只是想要簡單的讓 webpack 幫我們自動換版本號而已，小魚自己實在不想為了這件事再多加入這些東西。經過一段時間的 google + stackoverflow 之後，先寫出了以下的暴力做法。

在`webpack.config.js`的`plugin`處多加一個自己寫的 Plugin

``` javascript
plugins:[
    ...,
    function () {
        var templatePath = path.resolve(__dirname, 'templates');
        var rawFilePath = path.join(templatePath, 'src/scripts.html');
        var outFilePath = path.join(templatePath, 'base/partials/scripts.html');
        var str = fs.readFileSync(rawFilePath, 'utf8');
        if (process.env.NODE_ENV === 'production') {
            this.plugin("done", function (stats) {
                var counter = 0;
                var replaceInFile = function (toReplace, replacement) {
                    var replacer = function (match) {
                        console.log('Replacing %s => %s', match, replacement);
                        return replacement
                    };
                    str = str.replace(new RegExp(toReplace, 'g'), replacer);
                    counter++;
                    if (counter === stats.compilation.chunks.length)
                        fs.writeFileSync(outFilePath, str);
                };
                stats.compilation.chunks.forEach(function (chunk) {
                    replaceInFile(
                        chunk.name + '.js',
                        chunk.name + '.' + chunk.renderedHash + '.js'
                    );
                });
            });
        }
        else {
            fs.createReadStream(rawFilePath).pipe(fs.createWriteStream(outFilePath));
        }
    }
]
```
我們把`<scripts>`部分的 html 獨立成一個 template，然後直接使用`node`的`fs`來進行檔案的 I/O，讀入`<script>`的 template ，然後將檔案中的檔案名稱置換成帶有`chunkhash`的字串，再輸出成`production`用的 template。

我們設定`this.plugin`只在`NODE_ENV === 'production'`的時候執行，並且是在 webpack 已經打包完的`done`的階段，把結果的資訊讀出來，然後進行操作。而在開發模式下，不用多帶`chunkhash`可以省下一些麻煩，所以就略過這步驟。也可以把這段 code 寫成一個插件，然後在`webpack.config.js`引入，會讓程式碼看起來乾淨些。這邊只是一個簡單的快速介紹。

要注意的是，雖然官方文件說：

> Running `webpack -p` (or equivalently `webpack --optimize-minimize --define process.env.NODE_ENV="'production'"`).  

但這裡的`process.env.NODE_ENV`並不是指定你執行時的`NODE_ENV`，而是對於 webpack 而言的變數。因此若我們就這麼執行`webpack -p --config webpack.config.js`，我們寫的那段 plugin 所認得的`process.env.NODE_ENV`是執行`webpack`指令的 node 環境，而非 webpack 自己設定的變數，webpack 還是只會跑開發部分的程式碼。（小魚還沒深入去了解其中的原因）

要解決這個問題，你可以使用官方的`EnvironmentPlugin`來處理，或者簡單地把你的指令改成`NODE_ENV=production webpack -p --config webpack.config.js`就可以了。

如此一來，在 production 環境下執行 `NODE_ENV=production webpack -p --config webpack.config.js`，webpack 就會幫我們把檔案打包好，加上`chunkhash`，然後再幫我們更改`<script>`的 template 了。

## 結語
這只是最、最、最基本的 webpack 功能，完全還無法體現 webpack 的強大之處。webpack 的各種插件、各類型檔案的花式打包、各種玄妙的 bundle 設定⋯⋯才是 webpack 強大且非同凡響的地方。不然其實以上這些功能，使用其他的打包工具也是能達到相同效果的。

這次只是簡單介紹了一下 webpack 最基本的使用與設定，若要深入感受 webpack 的強大，還是要多去瞭解與研究。