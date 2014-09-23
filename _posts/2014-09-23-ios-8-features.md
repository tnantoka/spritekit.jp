---
layout: post
title:  "iOS 8で追加されたSprite Kitの新機能をつまみ食い"
categories: ios8
author: tnantoka
---

iOS 8ではSpriteKitにかなり変更が加えられました。

概要は[What's New in iOS: iOS 8.0](https://developer.apple.com/library/ios/releasenotes/General/WhatsNewIniOS/Articles/iOS8.html#//apple_ref/doc/uid/TP40014205-SW10)に、
詳細は[SpriteKit Changes](https://developer.apple.com/library/ios/releasenotes/General/iOS80APIDiffs/frameworks/SpriteKit.html)にまとめられています。  
日本語だと、[iOS 8 for Developers - Apple Developer](https://developer.apple.com/jp/ios8/)に少しだけ記述があります。

※ ちなみに、iOS 7.1での変更点は[iOS 7.0 to iOS 7.1 API Differences](https://developer.apple.com/library/IOs/releasenotes/General/iOS71APIDiffs/index.html)にあり、ほんの少しだけです。

今回は、3D関連や物理エンジン、アニメーション関連など多数のアップデートがあり、Nodeの種類も増えました。

また、XcodeのGUIでシーンのコンテンツも編集できるようになりました。  
（`Game`テンプレートを利用してプロジェクトを作成すると、`sks`ファイルが用意されていてGUIでそのまま編集可能になっています。）

正直な所、変更点が多すぎて全て追えていないのですが、気になったものをいくつか触ってみました。

# SKFieldNode

Fieldは「場」といったところでしょうか。
バネや放射状の物理効果を与えることができるようです。

かなりいろいろなことができるようで、まだ把握しきれていません。
ひとまず箱の周りを円がバネっぽく動くサンプルを作りました。

{% include image.html path="posts/ios-8-api-diffs/skfieldnode" ext="gif" caption="SKFieldNode" %}

# SKLightNode

光を追加するノードです。ドラクエの松明的な表現が簡単にできそうでありがたいです。
サンプルでは画面右上に置いています。

箱は光を受けているのがわかると思います。円は光の影響を受けていません。
（`SKSpriteNode`は`lightCategoryBitMask`が設定できため。どうやら`SKSpriteNode`にしか適用できないようです。）

{% include image.html path="posts/ios-8-api-diffs/sklightnode" caption="SKFieldNode" %}

# SKView#showsPhysics

Nodeに設定した`SKPhysicsBody`を枠線で表示してくれる機能です。
iOS 7.1で追加されていたようです。知りませんでした。
これでようやく他の物理エンジンと同じように、物理体を目で確認しながらデバッグできるようになります。  
色がかなり見づらいのが気になりますが…。

{% include image.html path="posts/ios-8-api-diffs/showsphysics" caption="showsPhysics" %}

今回はここまで。ソースコードはこちらです。  
[sj-posts-apps/iOS8Features at master · tnantoka/sj-posts-apps](https://github.com/tnantoka/sj-posts-apps/tree/master/iOS8Features)

他の作業をする中で新機能を触ることがあれば、また追記します。

