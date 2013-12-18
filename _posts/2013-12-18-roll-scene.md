---
layout: post
title:  "エンディング"
categories: rpg
author: tnantoka
---

所謂スタッフロール。

設定ファイルで表示する内容を指定します。  
（Xcodeのインデントがなんか変で見づらい…）

#### roll_ending.json
{% highlight js %}
{
    "type" : "roll",
    "roll" : [
              {
              "text" : "Prototype Quest",
              "size" : 24.0
              },
              {
              "text" : "Staff",
              "size" : 20.0
              },
              {
              "text" : "tnantoka",
              "size" : 20.0
              },
              {
              "text" : "Special Thanks",
              "size" : 24.0
              },
              {
              "text" : "Browser Quest",
              "size" : 20.0
              },
              {
              "text" : "mosamosa font",
              "size" : 20.0
              },
              {
              "text" : "Fin",
              "size" : 28.0
              }
              ],
    "speed" : 4.0,
    "next" : "title"
}
{% endhighlight %}

これを下から上へスクロールさせながら表示して、
終わったらnextで指定されているタイトル画面に遷移させます。

#### SJRollScene.m
{% highlight objc %}
- (void)createSceneContents {

    _labelNodes = @[].mutableCopy;
    
    for (NSDictionary *label in self.sceneData[@"roll"]) {
        SKLabelNode *labelNode = [SKLabelNode labelNodeWithFontNamed:FONT_NORMAL];
        labelNode.text = label[@"text"];
        labelNode.fontSize = [label[@"size"] floatValue];
        [_labelNodes addObject:labelNode];
    }
    
    [self performSelector:@selector(showNextLabelNode) withObject:nil afterDelay:DELAY];
    
}

- (void)showNextLabelNode {
    
    SKLabelNode *labelNode = _labelNodes.firstObject;
    labelNode.position = CGPointMake(CGRectGetMidX(self.frame), 0);
    [self addChild:labelNode];

    CGFloat y;
    CGFloat duration;
    if (_labelNodes.count > 1) {
        y = CGRectGetHeight(self.frame) + CGRectGetHeight(labelNode.frame);
        duration = [self.sceneData[@"speed"] floatValue];
    } else {
        y = CGRectGetMidY(self.frame) + CGRectGetMidY(labelNode.frame);
        duration = [self.sceneData[@"speed"] floatValue] / 2.0f;
    }

    SKAction *moveX = [SKAction moveByX:0 y:y duration:duration];
    SKAction *run = [SKAction runBlock:^{
        if (_labelNodes.count > 1) {
            [_currentLabelNode removeFromParent];
            [_labelNodes removeObjectAtIndex:0];
            [self showNextLabelNode];
        } else {
            self.nextScene = self.sceneData[@"next"];
            [self performSelector:@selector(loadNextScene) withObject:nil afterDelay:DELAY];
            return;
        }
    }];
    SKAction *sequence = [SKAction sequence:@[moveX, run]];
    [labelNode runAction:sequence];

    _currentLabelNode = labelNode;
}
{% endhighlight %}

ラベルの移動はSKActionで実施。  
移動と次のラベルを表示するアクションをそれぞれ用意して、sequenceにまとめてラベルに適用しています。

できました。

{% include image.html path="posts/rpg-roll-scene" caption="やっぱり最後はFin" ext="gif" %}

だいぶ必要そうな画面はそろってきました。  
そろそろ戦闘などのメイン部分に手を出したいと思います。

ソースコード: [sj-prototype-apps/SJRolePlaying at master · tnantoka/sj-prototype-apps](https://github.com/tnantoka/sj-prototype-apps/tree/master/SJRolePlaying)

