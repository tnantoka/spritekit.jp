---
layout: tutorial
title: sprite
---

本章からは、Sprite Kitに搭載されているゲーム開発のための様々な機能を、もう少し詳しく見ていきます。

まずはスプライト ( **SKSpriteNode** ) です。
スプライトはテクスチャ画像を画面に表示するためのクラスで、例えば、キャラクタや障害物を表現するために用いることができます。
また、実際のゲームではあまり利用しないかもしれませんが、色を指定して矩形を表示することもできます。

それでは、以下の画像[^1]と矩形を表示してみましょう。

{% include image.html path="tutorial/sprite/sword" caption="sword.png" %}

まずは、前章の手順で、`SJSprite`プロジェクトを作成します。

そして、`SJSpriteScene`を作成し、SKViewに表示させます。

#### SJViewController.m

SJSpriteSceneのインスタンスを作成して表示します。

{% highlight objc %}
- (void)viewDidLoad
{
    /* 省略 */   

    SKScene *scene = [SJSpriteScene sceneWithSize:self.view.bounds.size];
    [skView presentScene:scene];
}
{% endhighlight %}

#### SJSpriteScene.h

シーンのヘッダファイルは、Sprite Kitをインポートしている以外、特別なところはありません。

{% highlight objc %}
#import <SpriteKit/SpriteKit.h>

@interface SJSpriteScene : SKScene

@end
{% endhighlight %}

#### SJSpriteScene.m

シーンが表示された時に呼ばれる`didMoveToView:`メソッド内で、初期化をしています。
ただし、このメソッドは画面表示の度に呼ばれるため、`_contentCreated`フラグによって、一度だけ初期化するようにしています。

{% highlight objc %}
#import "SJSpriteScene.h"

@implementation SJSpriteScene {
    BOOL _contentCreated;
}

- (void)didMoveToView:(SKView *)view {
    if (!_contentCreated) {
        [self createSceneContents];
        _contentCreated = YES;
    }
}

- (void)createSceneContents {
}

@end

{% endhighlight %}

この時点で実行すると、もうお馴染みになったFPS等の情報のみの画面が表示されます。

{% include image.html path="tutorial/sprite/scene" caption="SJSpriteScene" %}

これで準備は整いました。

`createSceneContents`の中に、スプライトを表示するコードを書いてみましょう。
`sword.png`をプロジェクトに追加するのを忘れないでください。

{% highlight objc %}
    SKSpriteNode *sword = [SKSpriteNode spriteNodeWithImageNamed:@"sword"];
    sword.position = CGPointMake(CGRectGetMidX(self.frame), CGRectGetMidY(self.frame));
    [self addChild:sword];

    SKSpriteNode *square = [SKSpriteNode spriteNodeWithColor:[UIColor grayColor] size:CGSizeMake(30.0f, 30.0f)];
    square.position = CGPointMake(sword.position.x, sword.position.y - 50.0f);
    [self addChild:square];
{% endhighlight %}

実行すると、画面の中央に剣が、その少し下にグレーの矩形が表示されています。
{% include image.html path="tutorial/sprite/sword_square" caption="剣と矩形を表示" %}

なお、Sprite Kitの座標系は**左下が原点**となります。（iOS・Mac共に）

#### 色付け

SKSpriteNodeでは、画像をそのまま表示するだけでなく、色に変化を加えることができます。
以下のコードは赤色を0.2〜1.0の強さでブレンドしています。
例えば、ステータス異常や属性等を表現するのに便利に使える機能でしょう。

{% highlight objc %}
    for (int i = 1; i <= 5; i++) {
        SKSpriteNode *coloredSword = [SKSpriteNode spriteNodeWithImageNamed:@"sword"];
        coloredSword.position = CGPointMake(i * 55.0f, square.position.y - 50.0f);
        coloredSword.color = [SKColor redColor];
        coloredSword.colorBlendFactor = i * 2 / 10.0f;
        [self addChild:coloredSword];
    }
{% endhighlight %}

なお、**SKColor**は、プラットフォームに応じた色を返してくれるマクロです。（iOSではUIColor、MacだとNSColor）

{% include image.html path="tutorial/sprite/color" caption="剣に赤色をブレンド" %}

#### サイズ変更

xScale・yScaleの値を変更すれば、リサイズも簡単にできます。
以下は2倍に拡大する例です。

{% highlight objc %}
    SKSpriteNode *resizedSword = [SKSpriteNode spriteNodeWithImageNamed:@"sword"];
    resizedSword.position = CGPointMake(sword.position.x, sword.position.y + 100.0f);
    resizedSword.xScale = 2.0f;
    resizedSword.yScale = 2.0f;
    [self addChild:resizedSword];
{% endhighlight %}

{% include image.html path="tutorial/sprite/resize" caption="剣を拡大" %}

#### 基準点と回転

スプライトは**Anchor Point**を基準にして表示されます。
デフォルトでは`( 0.5, 0.5 )`、つまり中心に設定されており、座標の指定や回転はその点を軸にして行われます。

以下は同じように座標指定、回転をした例ですが、`anchorPoint`が一方は中央、もう一方は右下と異なっているため、背景のボックスとの重なり方が異なっています。
なお、zPositionは大きいほど手前に表示されます。

{% highlight objc %}
    // 基準点中央（左から2番目）
    SKSpriteNode *centerSword = [SKSpriteNode spriteNodeWithImageNamed:@"sword"];
    centerSword.position = CGPointMake(sword.position.x - 55.0f, resizedSword.position.y + 80.0f);
    centerSword.zPosition = 1.0f;
    [self addChild:centerSword];
    
    SKSpriteNode *centerBox = [SKSpriteNode spriteNodeWithColor:[UIColor grayColor] size:CGSizeMake(50.0f, 50.0f)];
    centerBox.position = centerSword.position;
    [self addChild:centerBox];

    // 基準点中央・回転（一番左）
    SKSpriteNode *centerRotatedSword = [SKSpriteNode spriteNodeWithImageNamed:@"sword"];
    centerRotatedSword.position = CGPointMake(centerSword.position.x - 55.0f, centerSword.position.y);
    centerRotatedSword.zRotation = 30.0f * M_PI / 180.0f;
    centerRotatedSword.zPosition = 1.0f;
    [self addChild:centerRotatedSword];
    
    SKSpriteNode *centerRotatedBox = [SKSpriteNode spriteNodeWithColor:[UIColor grayColor] size:CGSizeMake(50.0f, 50.0f)];
    centerRotatedBox.position = centerRotatedSword.position;
    [self addChild:centerRotatedBox];

    // 基準点右下（右から2番目）
    SKSpriteNode *bottomSword = [SKSpriteNode spriteNodeWithImageNamed:@"sword"];
    bottomSword.position = CGPointMake(sword.position.x + 55.0f, centerRotatedSword.position.y);
    bottomSword.zPosition = 1.0f;
    bottomSword.anchorPoint = CGPointMake(1.0f, 1.0f);
    [self addChild:bottomSword];
    
    SKSpriteNode *bottomBox = [SKSpriteNode spriteNodeWithColor:[UIColor grayColor] size:CGSizeMake(50.0f, 50.0f)];
    bottomBox.position = bottomSword.position;
    [self addChild:bottomBox];

    // 基準点右下・回転（一番右）
    SKSpriteNode *bottomRotatedSword = [SKSpriteNode spriteNodeWithImageNamed:@"sword"];
    bottomRotatedSword.position = CGPointMake(bottomSword.position.x + 55.0f, bottomSword.position.y);
    bottomRotatedSword.zRotation = 30.0f * M_PI / 180.0f;
    bottomRotatedSword.zPosition = 1.0f;
    bottomRotatedSword.anchorPoint = CGPointMake(1.0f, 1.0f);
    [self addChild:bottomRotatedSword];
    
    SKSpriteNode *bottomRotatedBox = [SKSpriteNode spriteNodeWithColor:[UIColor grayColor] size:CGSizeMake(50.0f, 50.0f)];
    bottomRotatedBox.position = bottomRotatedSword.position;
    [self addChild:bottomRotatedBox];
{% endhighlight %}

{% include image.html path="tutorial/sprite/anchor" caption="基準点を変更して移動・回転" %}

このようにSKSpriteNodeを使うと、テクスチャ画像を様々な効果と共に、簡単に表示することができます。

[^1]: 画像は[BrowserQuest](https://github.com/browserquest/BrowserQuest)内のものを、[CC-BY-SAライセンス](http://creativecommons.org/licenses/by-sa/3.0/deed.ja)にしたがって再利用しています。（そのため、本チュートリアルも同じライセンスとなります。）
