---
layout: post
title:  "会話後に他のシーンに遷移する"
categories: rpg
author: tnantoka
---

そろそろお店の中を歩くだけは飽きてきたので、他のシーンに移動したいと思います。  
まだまだ足りない機能はあるのですが、今はあくまでプロトタイプなので、細かいのは実際にゲームに組み込む時に実装する予定。

今回からSceneの構成を変更しました。  
ベースとしてSJBaseSceneを作成。シーンの情報を定義したjsonファイルの内容を元に、各シーンを読み込みます。

#### SJBaseScene

{% highlight objc %}
- (id)initWithSize:(CGSize)size name:(NSString *)name {
    if (self = [super initWithSize:size]) {
        NSString *path = [[NSBundle mainBundle] pathForResource:name ofType:@"json"];
        NSData *data = [NSData dataWithContentsOfFile:path];
        NSError *error = nil;
        self.sceneData = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingAllowFragments error:&error];
        if (error) {
            NSLog(@"%@", [error localizedDescription]);
        }
    }
    return self;
}

- (void)loadScene:(NSString *)name {
    SKScene *scene;
    if ([name hasPrefix:@"story"]) {
        scene = [[SJStoryScene alloc] initWithSize:self.size name:name];
    }
    [self.view presentScene:scene];
}

- (void)loadNextScene {
    if (self.nextScene) {
        [self loadScene:self.nextScene];
    }
}
{% endhighlight %}

以下が今回利用した`story_opening.json`です。  
*type*が`stroy`となっているため、SJStorySceneを読み込みます。

{% highlight js %}
{
    "type" : "story",
    "map" : "map_shop",
    "events" : {
        "c1" : {
            "type" : "message",
            "message" : {
                "en" : "hello, world.",
                "ja" : "よくきた、○○よ。待っておったぞ。ここは××研究所。これから旅に出るお主に、託したいものがあって呼んだのじゃ。その宝箱の中身を持って行くがよい。世界の平和を頼んだぞ。"
            },
            "next" : "story_001"
        }
    }
}
{% endhighlight %}

また、nextで設定されているのが遷移先のシーンです。  
今回はまだ他のシーンがないため、自分自身を指定しています。  
これを以下のように、会話が始まる時にnextSceneプロパティに保持します。

#### SJStroyScene

{% highlight objc %}
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
    
    if ((firstBody.categoryBitMask & playerCategory) != 0) {
        if ((secondBody.categoryBitMask & characterCategory) != 0) {
            SJCharacterNode *node = (SJCharacterNode *)secondBody.node;
            NSString *name = node.name;
            NSDictionary *event = self.sceneData[@"events"][name];
            if ([event[@"type"] isEqualToString:@"message"]) {
                _state = SJStorySceneStateMessage;
                [self messageNode].message = event[@"message"][[SJUtilities lang]];
                [self messageNode].hidden = NO;
                self.nextScene = event[@"next"];

                [[self playerNode] removeAllActions];
            }
            
        }
    }
}
{% endhighlight %}

そして、メッセージの表示が終わった時に、loadNextSceneを呼び出します。  
loadNextSceneは冒頭のSJBaseSceneで定義されているメソッドで、nextSceneが設定されていればそのシーンに遷移します。

#### SJStroyScene

{% highlight objc %}
- (void)touchesBegan:(NSSet *)touches withEvent:(UIEvent *)event {
    
    UITouch *touch = [touches anyObject];
    CGPoint locaiton = [touch locationInNode:[self mapNode]];
    
    switch (_state) {
        case SJStorySceneStateWalk:
            [[self playerNode] moveTo:locaiton];
            break;
        case SJStorySceneStateMessage:
            if ([[self messageNode] hasNext]) {
                [[self messageNode] next];
            } else {
                [self messageNode].hidden = YES;
                _state = SJStorySceneStateWalk;
                [self loadNextScene];
            }
            break;
    }
}
{% endhighlight %}

これで、博士との会話が終わると他のシーンに移動するようになりました。

{% include image.html path="posts/shop-to-other-scene" ext="gif" caption="無限ループ" %}

ソースコード: [sj-prototype-apps/SJRolePlaying at master · tnantoka/sj-prototype-apps](https://github.com/tnantoka/sj-prototype-apps/tree/master/SJRolePlaying)

