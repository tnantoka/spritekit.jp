---
layout: post
title:  "大きなサイズのテクスチャが真っ黒になる"
categories: problem
author: tnantoka
---

Xcode 5.0で遭遇した問題。

[BrowserQuestのtilesheet](https://github.com/browserquest/BrowserQuest/blob/master/client/img/3/tilesheet.png)を使って、マップを表示しようとしてたんですが、何度やってもうまくいかなくて困りました。

いろいろ試していて判明したのは、大きなサイズ（容量ではなくピクセル数）を指定したSKTextureが真っ黒になるということでした。

{% include image.html path="posts/large-texture/list" caption="試したサイズ" %}

{% include image.html path="posts/large-texture/200x4096" caption="4096は表示される" %}
{% include image.html path="posts/large-texture/200x4097" caption="4097は真っ黒になる" %}
{% include image.html path="posts/large-texture/600x4096" caption="幅を広げても4096は問題なし" %}
{% include image.html path="posts/large-texture/100x4097" caption="幅を小さくしても4097はやっぱりダメ" %}

こんな感じで、4097ピクセル以上になると表示されなくなってしまうようです。
幅を変えても関係なさそうだったので、1辺の長さが問題になる模様。

[SKTexture Class Reference](https://developer.apple.com/library/ios/documentation/SpriteKit/Reference/SKTexture_Ref/Reference/Reference.html)には特に何も書いていない気がしますし、エラーログなども出ていません。

サイズを小さくするしかない？  
そもそも全ての環境で発生する問題なのかも不明ですが…。

ソースコードは、  
[sj-posts-apps/SJLargeTexture at master · tnantoka/sj-posts-apps](https://github.com/tnantoka/sj-posts-apps/tree/master/SJLargeTexture)  
に置いてありますので、ご自由にどうぞ。

何かわかったらまた書きます。

