---
layout: post
title:  "Spkite Kitの物理エンジン向けデバッグドロー用ライブラリ「PhysicsDebugger」"
categories: libraries
author: tnantoka
---

Sprite Kitには物理エンジンが組み込まれており、簡単に物理シミュレーションが利用できて便利です。  
ただ、デバッグ表示用の機能がないため、どこにPhysicsBodyを追加したか、見た目では知ることができません。  

そんな不満を解決してくれるのが、[PhysicsDebugger](http://www.ymc.ch/en/ios-7-sprite-kit-physics-debugging-tool)です。

早速使ってみます。

### インストール

CocoaPodsに対応してるので簡単です。

{% highlight sh %}
# ターミナルを起動してプロジェクトのフォルダまで移動

# CocoaPodsをインストールしてない人
$ gem install cocoapods
$ pod install 

# Podfile
platform :ios, '7.0'

pod 'PhysicsDebugger'

# インストール
$ pod
Analyzing dependencies
Downloading dependencies
Installing PhysicsDebugger (1.0.0)
Generating Pods project
Integrating client project

[!] From now on use `SJRolePlaying.xcworkspace`.
{% endhighlight %}

CocoaPodsを初めて使う場合、これ以降.xcodeprojではなく、.xcworkspaceを開く必要があることに注意してください。

### 利用方法

ヘッダをインポートして、描画対象のノードが作成される前に、`init`を呼び、
`drawPhysicsBodies`を呼びます。

今回は、[SJMapNodeに追加](https://github.com/tnantoka/sj-prototype-apps/blob/4c73d46415c0cfaf1750bc8d421857e0bbffa03a/SJRolePlaying/SJRolePlaying/SJMapNode.m)してみました。

{% highlight objc %}
#import "YMCPhysicsDebugger.h"
#import "YMCSKNode+PhysicsDebug.h"

- (void)createNodeContents {
    
    [YMCPhysicsDebugger init];

    /* ノードの作成・追加 */
    
    [self drawPhysicsBodies];
}
{% endhighlight %}

これで実行すると、以下のようにPhysicsBodyに赤枠がついて可視化されます。

{% include image.html path="posts/ymc-physics-debugger" caption="赤枠が表示される" %}

### 感想

手軽に使えて便利でした。

ただ、ちょっとコードに手を加える量が多いかなぁ、という印象。
まぁそれでも、毎回PhysicsBodyと同じ大きさのShapeNodeを作成して追加する、とかに比べればはるかに綺麗ですが。

あと、このライブラリに限った話ではないですが、デバッグドローのぶんNodeの数が増えて動作がもっさりになるので、常に使用しながらの開発は厳しいかもしれません。

しばらく使って様子を見てみようと思います。


