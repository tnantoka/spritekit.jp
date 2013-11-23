---
layout: post
title:  "はい・いいえの確認"
categories: rpg
author: tnantoka
---

昔ながらのお使いゲーでお馴染み、はい・いいえの確認。  
はいと言うまで前に進ませてくれません。

専用のNodeを作ってもいいのですが、今回は手抜きでUIAlertViewで済ませます。

設定ファイルは以下のとおりです。

#### story_confirm.json
{% highlight js %}
{
    "type" : "story",
    "map" : "map_shop",
    "events" : {
        "c1" : {
            "type" : "confirm",
            "message" : {
                "en" : "OK?",
                "ja" : "やってくれるな？"
            },
            "yes" : "c1y",
            "no" : "c1n"
        },
        "c1y" : {
            "type" : "message",
            "message" : {
                "en" : "Thank you!",
                "ja" : "おぉ、やってくれるか！では頼んだぞ。"
            },
            "next" : "story_confirm"
        },
        "c1n" : {
            "type" : "message",
            "message" : {
                "en" : "…",
                "ja" : "…。"
            },
        }
    }
}
{% endhighlight %}

*Yes*をタップされると`c1y`、*No*をタップされると`c1n`に進むようにします。[^1]

#### SJStroyScene.m
{% highlight objc %}
- (void)processEvent:(NSString *)name {
    
    NSDictionary *event = self.sceneData[@"events"][name];

    if (event) {
        [[self playerNode] removeAllActions];
    }

    if ([event[@"type"] isEqualToString:@"message"]) {
        _state = SJStorySceneStateMessage;
        [self messageNode].message = event[@"message"][[SJUtilities lang]];
        [self messageNode].hidden = NO;
        self.nextScene = event[@"next"];
        
    } else if ([event[@"type"] isEqualToString:@"confirm"]) {
        
        NSString *message = event[@"message"][[SJUtilities lang]];
        
        UIAlertView *alertView = [UIAlertView alertViewWithTitle:nil message:message];
        [alertView addButtonWithTitle:NSLocalizedString(@"Yes", nil) handler:^{
            [self processEvent:event[@"yes"]];
        }];
        [alertView addButtonWithTitle:NSLocalizedString(@"No", nil) handler:^{
            [self processEvent:event[@"no"]];
        }];
        [alertView show];
        
    }
    
}
{% endhighlight %}

できました。

{% include image.html path="posts/rpg-confirm-event" caption="はいと言うまで許さない" %}

次はテキスト入力を、これもUIAlertViewを使って実装予定。

ソースコード: [sj-prototype-apps/SJRolePlaying at master · tnantoka/sj-prototype-apps](https://github.com/tnantoka/sj-prototype-apps/tree/master/SJRolePlaying)

[^1]: [BlocksKit](https://github.com/pandamonia/BlocksKit)を使用しています。 
