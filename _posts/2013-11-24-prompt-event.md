---
layout: post
title:  "主人公の名前を入力"
categories: rpg
author: tnantoka
---

これも昔からお馴染み、「君の名前は？」イベント。  
顔見知りなのに名前を知らない不思議。

Confirmと同じくUIAlertViewで済ませます。

まずは設定ファイル。

#### story_prompt.json
{% highlight js %}
{
    "type" : "story",
    "map" : "map_shop",
    "events" : {
        "c1" : {
            "type" : "message",
            "message" : {
                "en" : "Hi,",
                "ja" : "やあ。"
            },
            "next" : "c1c"
        },
        "c1c" : {
            "type" : "prompt",
            "message" : {
                "en" : "What is your name?",
                "ja" : "君の名前は？"
            },
            "key" : "username",
            "next" : "c1a"
        },
        "c1a" : {
            "type" : "message",
            "message" : {
                "en" : "<username>...OK, Welcome <username>!",
                "ja" : "<username>か、いい名前だ。よろしく、<username>！"
            },
            "next" : "story_prompt"
        }
    }
}
{% endhighlight %}

まずは、「やぁ」とメッセージを表示。  
その後テキスト入力用のアラートを表示して、入力内容を*key*に指定されている`username`をキーにNSUserDefaultに保存します。  
そして、保存された内容を使ってメッセージを表示します。

アラート表示は以下のような実装。
#### SJStroyScene.m
{% highlight objc %}
- (void)processEvent:(NSString *)name {
    
    /* 省略 */

    } else if ([event[@"type"] isEqualToString:@"prompt"]) {
        
        NSString *message = event[@"message"][[SJUtilities lang]];
        
        __weak UIAlertView *alertView = [UIAlertView alertViewWithTitle:nil message:message];
        alertView.alertViewStyle = UIAlertViewStylePlainTextInput;
        [alertView addButtonWithTitle:NSLocalizedString(@"OK", nil) handler:^{
            NSString *text = [alertView textFieldAtIndex:0].text;
            NSString *key = event[@"key"];
            [[NSUserDefaults standardUserDefaults] setObject:text forKey:key];
            [self processEvent:event[@"next"]];
        }];
        [alertView show];
        
    }

}
{% endhighlight %}

メッセージ内にある`<username>`は以下の処理で置換されます。
{% highlight objc %}
- (NSString *)replaceKeys:(NSString *)message {
 
    NSMutableString *replaced = message.mutableCopy;
    NSError *error = nil;
    NSRegularExpression *regexp = [NSRegularExpression regularExpressionWithPattern:@"<([^>]+)>" options:0 error:&error];
    if (error) {
        NSLog(@"%@", error.localizedDescription);
    }
    
    NSMutableArray *keys = @[].mutableCopy;
    [regexp enumerateMatchesInString:message options:0 range:NSMakeRange(0, message.length) usingBlock:^(NSTextCheckingResult *result, NSMatchingFlags flags, BOOL *stop) {
        NSString *key = [message substringWithRange:[result rangeAtIndex:1]];
        [keys addObject:key];
    }];
    
    for (NSString *key in keys) {
        [replaced replaceOccurrencesOfString:[NSString stringWithFormat:@"<%@>", key] withString:[[NSUserDefaults standardUserDefaults] stringForKey:key] options:0 range:NSMakeRange(0, replaced.length)];
    }
    
    return replaced;
}
{% endhighlight %}

動作確認してみます。

入力。
{% include image.html path="posts/rpg-prompt-event/alert" caption="黒歴史になりがち" %}

表示。
{% include image.html path="posts/rpg-prompt-event/replace" caption="馴れ馴れしい" %}

できました。

ソースコード: [sj-prototype-apps/SJRolePlaying at master · tnantoka/sj-prototype-apps](https://github.com/tnantoka/sj-prototype-apps/tree/master/SJRolePlaying)

