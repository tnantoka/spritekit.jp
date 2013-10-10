---
layout: tutorial
title: physics
---

ゲームは架空の世界ですが、多くの場合キャラクター達は物理法則に従って動きます。
ジャンプをすれば放物線を描いて地上に戻ってきたり、足を踏み外せば真っ逆さまに落下していったり。

違和感なく物理演算を行なうのは大変ですが、**物理エンジン**を使うと、これらの計算を簡単に行うことができます。
そして、標準でその機能が組み込まれています。

本章ではシーンに物理シミュレーションを適用する方法を紹介します。

まずは、シーンにボールを描いてみましょう。
タップした座標にランダムな大きさ・色・透明度でSKShapeNodeによる図形を追加します。

{% highlight objc %}
static inline CGFloat skRandf() {
    return rand() / (CGFloat) RAND_MAX;
}
static inline CGFloat skRand(CGFloat low, CGFloat high) {
    return skRandf() * (high - low) + low;
}

- (SKNode *)newBall {
    SKShapeNode *ball = [SKShapeNode node];
    CGMutablePathRef path = CGPathCreateMutable();
    CGFloat r = skRand(3, 30);
    CGPathAddArc(path, NULL, 0, 0, r, 0, M_PI * 2, YES);
    ball.path = path;
    ball.fillColor = [SKColor colorWithRed:skRand(0, 1.0f) green:skRand(0, 1.0f) blue:skRand(0, 1.0f) alpha:skRand(0.7f, 1.0f)];
    ball.strokeColor = [SKColor clearColor];
    ball.position = CGPointMake(CGRectGetMidX(self.frame), self.frame.size.height - r);
    return ball;
}

- (void)touchesBegan:(NSSet *)touches withEvent:(UIEvent *)event {
    if (touches.count == 1) {
        UITouch *touch = [touches anyObject];
        CGPoint location = [touch locationInNode:self];
        
        SKNode *ball = [self newBall];
        ball.position = location;
        [self addChild:ball];
    }
}
{% endhighlight %}

ランダムな数値を取得する`skRandf`と`skRand`はAppleのSprite Kit Programming Guide[^1]から引用しています。メソッド呼び出しのオーバーヘッドをなくすためにinline指定されています。

{% include image.html path="tutorial/physics/ball" caption="ボールを表示" %}

さて、たくさんのボールは描画できましたが、宙に浮いたまま止まっているのは不自然です。

落下させるにはどうしたらいいでしょうか。
例えば、`update:`でy座標を減らしていけば実現できるでしょう。では、ボール同士の衝突はどう実現しましょう。このように違和感のない動きをさせるための課題は山積みです。

ここで物理エンジンの登場です。
ノードにボディ ( **SKPhysicsBody** ) を設定すると、Sprite Kitによる物理シミュレーションの対象となります。

以下のように、ボールと同じサイズ・形のphysicsBodyを設定すれば上で書いた落下・衝突がいとも簡単に実現できます。
また、画面が壁で囲まれているようにするためは、シーンにもphysicsBodyを設定します。

{% highlight objc %}
- (void)createSceneContents {
    self.physicsBody = [SKPhysicsBody bodyWithEdgeLoopFromRect:self.frame];
}

- (SKNode *)newBall {
    /* 省略 */
    
    ball.physicsBody = [SKPhysicsBody bodyWithCircleOfRadius:r];
    
    return ball;
}
{% endhighlight %}

{% include image.html path="tutorial/physics/fall" caption="ボールが落下" ext="gif" %}

重力を操作することも簡単です。
画面を2本指でタップすると重力を反転するようにしてみましょう。

{% highlight objc %}
    else if (touches.count == 2) {
        self.physicsWorld.gravity = CGVectorMake(0, self.physicsWorld.gravity.dy * -1.0f);
    }
{% endhighlight %}

{% include image.html path="tutorial/physics/flow" caption="ボールが浮遊" ext="gif" %}

このように、Sprite Kitの組み込み物理エンジンを使うと、シミュレーションが簡単に実現できます。

[^1]: [Creating Nodes That Interact with Each Other](https://developer.apple.com/library/ios/documentation/GraphicsAnimation/Conceptual/SpriteKit_PG/GettingStarted/GettingStarted.html#//apple_ref/doc/uid/TP40013043-CH2-SW14)
