---
layout: tutorial
title: particle
---

パーティクルというCGの技術があります。
炎や水といった自然界の曖昧なものを、小さな粒子の集合によって表現する手法です。

これも物理シミュレーションと同じく自分で実装しようとすると大変ですが、Sprite Kitにはこの機能も専用エディタと共にビルトインされています。

早速、炎を表示してみましょう。

*New File...*から`SpriteKit Particle File`を選択します。
{% include image.html path="tutorial/particle/file" caption="SpriteKit Particle File" %}

*Particle template*は`Fire`を利用します。
{% include image.html path="tutorial/particle/fire" caption="Fire" %}

これを`fire.sks`として保存し、Xcodeで開くと以下のようなエディタが表示されます。
{% include image.html path="tutorial/particle/editor" caption="Particle Emitter Editor" %}

**Particle Emitter Editor**上では、パーティクルをGUIで様々にカスタマイズ可能です。例えば*Color Ramp*を修正するだけで、青い炎を作ることができます。
{% include image.html path="tutorial/particle/blue" caption="青い炎" %}

sksファイルを使ってパーティクルを画面に表示するには、`SKEmitterNode`を利用します。
`SJParticleScene`を作成し、以下のようなコードを記載しましょう。

{% highlight objc %}
- (void)createSceneContents {
    NSString *firePath = [[NSBundle mainBundle] pathForResource:@"fire" ofType:@"sks"];
    SKEmitterNode *fire = [NSKeyedUnarchiver unarchiveObjectWithFile:firePath];
    fire.position = CGPointMake(30.0f, 30.0f);
    fire.xScale = fire.yScale = 0.5f;
    [self addChild:fire];
}
{% endhighlight %}

{% include image.html path="tutorial/particle/blue" caption="青い炎" ext="gif" %}

たったこれだけで、リアルな炎を表示することができました。

ただ、表示するだけではありがたみが少ないので、ボールに剣があったら爆発して消えるようにしてみましょう。

まずはボールをいくつか配置し、重力を反転させて、浮かべておきます。

{% highlight objc %}
- (void)createSceneContents {
    /* 省略 */

    self.physicsBody = [SKPhysicsBody bodyWithEdgeLoopFromRect:self.frame];
    self.physicsWorld.gravity = CGVectorMake(0, self.physicsWorld.gravity.dy * -1.0f);

    for (int i = 0; i < 30; i++) {
        [self addChild:[self newBall]];
    }
}

- (SKNode *)newBall {
    SKShapeNode *ball = [SKShapeNode node];
    CGMutablePathRef path = CGPathCreateMutable();
    CGFloat r = skRand(3, 30);
    CGPathAddArc(path, NULL, 0, 0, r, 0, M_PI * 2, YES);
    ball.path = path;
    ball.fillColor = [SKColor colorWithRed:skRand(0, 1.0f) green:skRand(0, 1.0f) blue:skRand(0, 1.0f) alpha:skRand(0.7f, 1.0f)];
    ball.strokeColor = [SKColor clearColor];
    ball.position = CGPointMake(skRand(0, self.frame.size.width), skRand(0, self.frame.size.height));
    
    ball.physicsBody = [SKPhysicsBody bodyWithCircleOfRadius:r];
    
    return ball;
}
{% endhighlight %}

{% include image.html path="tutorial/particle/ball" caption="ボール" %}

ここに剣を飛ばしてボールを破壊してみましょう。

剣の飛ばし方としては、SKActionの`moveTo:duration`を使うことも考えられますが、ここでは重力を無視しておいて、力を加えることで飛ばしています。
`affectedByGravity`が重力の影響を受けるかどうか、`velocity`が加える力を設定するプロパティです。

また、自分の剣同士がぶつかるのはおかしい[^2]ため、`collisionBitMask`を設定しています。
`categoryBitmask`によってそれぞれの物体にカテゴリを設定し、`collisionBitMask`には衝突させたい物体のカテゴリを指定します。
これによって、ボールはボールと剣、剣はボールのみと衝突します。
ボールには何も設定していませんが、これは、デフォルトで他の物体とぶつかるようになっているためです。

なお、剣のphysicsBodyはノードの大きさそのままだと他の物体に衝突しすぎてしまうため、小さめにしています。

今回の剣のように速く動くものや、小さいものは、`usesPreciseCollisionDetection`を指定することで正確に判定できます。
ただし、高コストになるので注意しましょう。

{% highlight objc %}
static const uint32_t swordCategory = 0x1 << 0;
static const uint32_t ballCategory = 0x1 << 1;

/* 省略 */

- (SKNode *)newBall {
    /* 省略 */
    
    ball.physicsBody = [SKPhysicsBody bodyWithCircleOfRadius:r];
    ball.physicsBody.categoryBitMask = ballCategory;
    
    return ball;
}

- (SKNode *)newSword {
    SKSpriteNode *sword = [SKSpriteNode spriteNodeWithImageNamed:@"sword"];
    sword.xScale = sword.yScale = 0.5f;
    sword.zRotation = -45.0f * M_PI / 180.0f;
    
    sword.physicsBody = [SKPhysicsBody bodyWithRectangleOfSize:CGRectApplyAffineTransform(sword.frame, CGAffineTransformMakeScale(0.7f, 0.7f)).size];
    sword.physicsBody.affectedByGravity = NO;
    sword.physicsBody.velocity = CGVectorMake(0, 1000.0f);
    sword.physicsBody.categoryBitMask = swordCategory;
    sword.physicsBody.collisionBitMask = ballCategory;
    sword.physicsBody.usesPreciseCollisionDetection = YES;

    return sword;
}

- (void)touchesBegan:(NSSet *)touches withEvent:(UIEvent *)event {
    UITouch *touch = [touches anyObject];
    
    CGPoint location = [touch locationInNode:self];
    
    SKNode *sword = [self newSword];
    sword.position = location;
    [self addChild:sword];
}
{% endhighlight %}

{% include image.html path="tutorial/particle/throw" caption="剣を飛ばす" ext="gif" %}

これで剣を飛ばすことができるようになりました。

次に剣とボールがぶつかった時に爆発させる処理です。これには所謂**当たり判定**の実装が必要ですが、これにも物理エンジンが利用できます。
`collisionBitMask`と同じ要領で、`contactBitMask`を設定すれば2つの物体が接触したときにdelegateメソッドが呼ばれるようになるため、そこで必要な処理をおこないます。

実装は以下のようになります。
`sword`の`contactBitMask`は、画面の枠とボールと接触するように設定します。
`didBeginContact:`が肝です。
渡されてくる物体の順番は順不同のため、最初のif文で`sword`が先に来るように2つの物体を並び替えています。
そして、swordがballと接触した場合、sparkのパーティクルを一瞬だけ表示すると共に、2つの物体を削除しています。
また画面の枠と接触した場合は、`sword`をただ削除するようにしています。

sparkのパーティクルは*Particle template*を`Spark`にして、デフォルトのままのものを利用しています。

{% highlight objc %}
static const uint32_t worldCategory = 0x1 << 2;

@interface SJParticleScene () <SKPhysicsContactDelegate>
@end

/* 省略 */
- (void)createSceneContents {

    /* 省略 */

    self.physicsWorld.contactDelegate = self;
    self.physicsBody.categoryBitMask = worldCategory;
    
    /* 省略 */
}

- (SKNode *)newSword {

    /* 省略 */
    sword.physicsBody.collisionBitMask = ballCategory;
    sword.physicsBody.contactTestBitMask = ballCategory | worldCategory;

    /* 省略 */
}

# pragma mark - SKPhysicsContactDelegate

- (void)didBeginContact:(SKPhysicsContact *)contact {
    SKPhysicsBody *firstBody, *secondBody;
    
    if (contact.bodyA.categoryBitMask < contact.bodyB.categoryBitMask) {
        firstBody = contact.bodyA;
        secondBody = contact.bodyB;
    } else {
        firstBody = contact.bodyB;
        secondBody = contact.bodyA;
    }
    
    if ((firstBody.categoryBitMask & swordCategory) != 0) {
        
        if ((secondBody.categoryBitMask & ballCategory) != 0) {
            NSString *sparkPath = [[NSBundle mainBundle] pathForResource:@"spark" ofType:@"sks"];
            SKEmitterNode *spark = [NSKeyedUnarchiver unarchiveObjectWithFile:sparkPath];
            spark.position = secondBody.node.position;
            spark.xScale = spark.yScale = 0.2f;
            [self addChild:spark];
            
            SKAction *fadeOut = [SKAction fadeOutWithDuration:0.3f];
            SKAction *remove = [SKAction removeFromParent];
            SKAction *sequence = [SKAction sequence:@[fadeOut, remove]];
            [spark runAction:sequence];
            
            [firstBody.node removeFromParent];
            [secondBody.node removeFromParent];
        } else if ((secondBody.categoryBitMask & worldCategory) != 0) {
            NSLog(@"contact with world");
            [firstBody.node removeFromParent];
        }
        
    }
}

{% endhighlight %}

{% include image.html path="tutorial/particle/attack" caption="ボールを破壊" ext="gif" %}

このように、Sprite Kitのパーティクル機能を使えば、手軽にゲームの表現力を向上させることができます。

[^1]: パーティクルファイルを開くと、Xcodeが落ちることがよくありますので注意してください。
[^2]: 物理的にはおかしくないですが、ゲームでは自分の弾同士はぶつからないものが多いので、それに合わせます。

