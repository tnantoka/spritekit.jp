---
layout: post
title:  "Apple Watch対応のミニゲームアプリ「反転一色（Flip One Color）」をリリースしました"
categories: update
author: tnantoka
---

初めてWatchKitを使ったアプリでしたが、無事審査を通過しました。  
所謂ライツアウトのクローンです。

{% include image.html path="games/fliponecolor/1" caption="iPhone" %}
{% include image.html path="games/fliponecolor/2" caption="Apple Watch" %}

無料です。暇潰しによろしければどうぞ。

<a href="https://geo.itunes.apple.com/jp/app/fan-zhuan-yi-se/id993434656?mt=8&uo=6" target="itunes_store" style="display:inline-block;overflow:hidden;background:url(http://linkmaker.itunes.apple.com/images/badges/ja-jp/badge_appstore-lrg.png) no-repeat;width:165px;height:40px;@media only screen{background-image:url(http://linkmaker.itunes.apple.com/images/badges/ja-jp/badge_appstore-lrg.svg);}"></a>

ソースコードは以下で公開しています。（Swiftです）

[tnantoka/FlipOneColor](https://github.com/tnantoka/FlipOneColor)


## 名前の由来

最初は各パネルをクリックしたら反転するアニメーションをさせるつもりだったため、**Flip**と付けて、後は響きで決めました。日本語は英語名を元に適当に翻訳しました。  
その後、WatchKitでのアニメーションはかなり面倒（連番の画像を用意しないといけない）ということがわかり断念しましたが、名前はそのままにしました。

## SpriteKitの利用箇所

今回のアプリは全体をUIKitで構築し、ホーム画面の一部にSKViewを貼って、そこだけSpriteKitにしました。

該当のSceneのソースはこちらです。  
[LightsOutScene.swift](https://github.com/tnantoka/FlipOneColor/blob/master/FlipOneColor/LightsOutScene.swift)

ゲームのロジック部分はWatchKitでも使う必要があるため、[LightsOut.swift](https://github.com/tnantoka/FlipOneColor/blob/master/FlipOneColor/LightsOut.swift) というモデルを作り、Sceneとは別に実装しています。
（SpriteKitはiOSとOS Xに関しては「Universal」ですが、Watch OSでは動きません…。）

`LightsOutScene`は、ライト数分の`SKShapeNode`を持っています。
処理としては、タップされる度にその情報を`LightsOut`モデルに渡し、その状態に合わせて各ノードを更新する、というシンプルなことしかやっていません。
WatchKit側を作った後だったのもあり、SpriteKitのお手軽さを改めて感じました。

## Realm

以前から興味のあった[Realm](https://realm.io/)をスコアの保存部分に使っています。

該当のコードはこれだけで、CoreDataやFMDBを使うよりはるかに簡単（おまじないが少なくて済む）でした。
ゲームも何かとデータベース必要なので、これからはRealmを使っていく予定です。

モデルはこの数行を書くだけです。  
[Score.swift](https://github.com/tnantoka/FlipOneColor/blob/master/FlipOneColor/Score.swift)

スコア保存処理はこんな感じで書けます。

{% highlight swift %}
func addScore() -> Bool {
    let moves = lightsOutScene.lightsOut.moves
    let level = lightsOutScene.lightsOut.level
    
    let score = Score()
    score.moves = moves
    score.level = level
    score.createdAt = NSDate()
    
    let newRecord = Score.isNewRecord(moves, level: level)
    
    let realm = RLMRealm.defaultRealm()
    realm.transactionWithBlock({ () -> Void in
        realm.addObject(score)
    })
    
    return newRecord
}
{% endhighlight %}

## iPhoneでPopover

iOS 8からポップオーバーがiPhoneでも使えるようになったということで、今回レベル選択に使ってみました。  
簡単でよかったです。

以下のページが参考になりました。

* [Swift - UIPopoverController in iOS 8 - Stack Overflow](http://stackoverflow.com/questions/27670160/swift-uipopovercontroller-in-ios-8)
* [【iOS8】iPhoneでViewControllerをPopover表示](http://dendrocopos.jp/wp/archives/698)


Apple Watch対応ゲーム、楽しいのでまた何か作ろうと思います。  
WatchKit関連でハマったことなどは[Qiita](http://qiita.com/tnantoka/items/1194c5318bdcba5e12ff)に書いています。

それではよろしくお願いします。

