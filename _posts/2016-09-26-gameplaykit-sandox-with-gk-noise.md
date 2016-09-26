---
layout: post
title:  "GameplayKit SandboxにGKNoiseのサンプルを追加しました"
categories: etc
author: tnantoka
---

[昨日](/etc/2016/09/25/what-s-new-in-spritekit-on-ios-10/)も少し触ったGKNoiseのサンプルを[GameplayKitSandbox](https://github.com/tnantoka/GameplayKitSandbox)に追加しました。

[GameplayKitのドキュメント](https://developer.apple.com/reference/gameplaykit)を見ると、`GKNoiseSource`のサブクラスは9つ用意されています。  
そのうち、`GKCoherentNoiseSource`は抽象クラスなので除外して、他の8つを並べてみました。

{% include image.html path="posts/gameplaykit-sandox-with-gk-noise" caption="GKNoiseSource" %}

Constantが単色でおや？と思いましたが、他のものと組み合わせて使うようです。

<https://developer.apple.com/reference/gameplaykit/gkconstantnoisesource>

今回はあまりいじっていませんが、それぞれのソースごとにいろいろと設定できるパラメータがあり、生成されるノイズを変化させることが可能です。  
わかりやすい例で言うと、`Checkerboard`の四角形のサイズが設定できます。

iOS 10の新機能にもだいぶ慣れてきたので、実際のゲーム開発に使ってみたいところです…。
