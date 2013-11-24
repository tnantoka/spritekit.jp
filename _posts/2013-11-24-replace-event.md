---
layout: post
title:  "宝箱を開ける"
categories: rpg
author: tnantoka
---

画面上のキャラクターを別のキャラクターに入れ替えます。  
なくても何とかなりそうですが、宝箱を開ける演出とかしたいので一応用意しておきます。

まずは設定。

「これじゃ！」とメッセージを表示した後、replaceイベントで`c2`というキャラクターを`c3`に入れ替え。  
その後またメッセージを表示。

という内容です。

#### story_prompt.json
{% highlight js %}
{
    "type" : "story",
    "map" : "map_shop",
    "events" : {
        "c1" : {
            "type" : "message",
            "message" : {
                "en" : "Here you are!",
                "ja" : "これじゃ！"
            },
            "next" : "c1a"
        },
        "c1a" : {
            "type" : "replace",
            "from" : "c2",
            "to" : "c3",
            "next" : "c1b"
        },
        "c1b" : {
            "type" : "message",
            "message" : {
                "en" : "Take good care of it.",
                "ja" : "お主の分身じゃ。大切にするんじゃぞ。"
            },
            "next" : "story_replace"
        }
    }
}
{% endhighlight %}

キャラクターの入れ替えは、`SJMapNode`にメソッドを追加して対応。
{% highlight objc %}
- (void)replaceCharacterNodeFrom:(NSString *)fromName to:(NSString *)toName {
    
    SKNode *fromNode = [self childNodeWithName:fromName];
    SKNode *toNode = [self newCharacterNode:toName];
    
    toNode.position = fromNode.position;
    
    [fromNode removeFromParent];
    [self addChild:toNode];
}
{% endhighlight %}

それを`SJStoryScene`から呼び出します。
{% highlight objc %}
- (void)processEvent:(NSString *)name {
    
    /* 省略 */

    } else if ([event[@"type"] isEqualToString:@"replace"]) {
        [[self mapNode] replaceCharacterNodeFrom:event[@"from"] to:event[@"to"]];
        [self processEvent:event[@"next"]];
    }
}
{% endhighlight %}

完成。
{% include image.html path="posts/rpg-replace-event" ext="gif" caption="モシャス" %}

いい感じです。

ソースコード: [sj-prototype-apps/SJRolePlaying at master · tnantoka/sj-prototype-apps](https://github.com/tnantoka/sj-prototype-apps/tree/master/SJRolePlaying)

