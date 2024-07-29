---
title: SwiftUI 如何在应用中使用地图并在地图中心位置显示当前的地理位置地址
date: 2024-05-30
---

在现代移动应用中，地图功能已经成为许多应用的重要组成部分。SwiftUI 提供了强大的地图支持，可以轻松地在应用中集成地图，并结合位置服务实现丰富的地理位置功能。本篇博客将介绍如何使用 SwiftUI 显示地图，并在地图中心位置显示当前的地理位置地址。

<!-- more -->

### 功能概述

我们将实现一个应用，该应用包含以下功能：

- 显示全屏地图。
- 在地图中心显示一个标记图标。
- 实时获取并显示地图中心位置的地理地址。

### 准备工作

首先，我们创建一个可观察的 MapService 类，用于管理地图状态和地理编码功能。

```swift

@Observable
class MapService {
    var currentPosition = MapCameraPosition.userLocation(followsHeading: true, fallback: MapCameraPosition.region(MKCoordinateRegion.init(center: LocationManager.defaultCoordinate, span: LocationManager.defaultCoordinateSpan)))

    var isGeoCoding = false

    var address: String? = nil

    var currentLocation = LocationManager.defaultCoordinate


    func reverGeoCode() {
        self.isGeoCoding = true
        let center = self.currentLocation
        let latitude = center.latitude
        let longitude = center.longitude
        let geoCoder = CLGeocoder()
        let location = CLLocation(latitude: latitude, longitude: longitude)
        geoCoder.reverseGeocodeLocation(location) { (placeMarks, error) in
            self.isGeoCoding = false
            if error != nil {
                self.address = error?.localizedDescription
            }else{
                if let placeMarks, let first = placeMarks.map({$0.description.components(separatedBy: "@").first}).first(where: {$0 != nil}) {
                    self.address = first
                }
            }
        }
    }
}

```

在 MapService 中，我们使用 @Observable 属性包装器使类的属性的变化能被 SwiftUI 视图观察到，并实现了逆地理编码的方法 reverseGeoCode。

### 创建 ContentView 视图

```swift

struct ContentView: View {

    @State private var service = MapService()

    var body: some View {
        ZStack(alignment:.center){
            Map(position: $service.currentPosition,interactionModes: .all)
                .onMapCameraChange({ result in
                    print("\(result.region.center)")
                    service.currentLocation = result.region.center
                    service.reverGeoCode()
                })
            Image(systemName: "mappin")
                .font(.largeTitle)
                .foregroundStyle(.blue)
                .offset(y: -16)
            bottomView
        }
    }

    @ViewBuilder
    var bottomView: some View {
        VStack {
            Spacer()
            VStack {
                HStack{
                    Text("当前位置：")
                        .font(.headline)
                        .foregroundColor(.black)
                    Spacer()
                }
                HStack{
                    if service.isGeoCoding {
                        HStack(alignment:.center){
                            Spacer()
                            ProgressView()
                                .progressViewStyle(CircularProgressViewStyle())
                            Spacer()
                        }
                    }else{
                        Text("\(service.address ?? "null")")
                            .font(.body)
                            .foregroundColor(.black)
                            .padding([.bottom,.top,],10)
                    }

                    Spacer(minLength: 10)
                }
            }
            .padding(10)
            .background(.bar)
            .cornerRadius(10)
            .padding()
        }
    }
}
```

### 主要部分分析

1.`@State`:

使用 @State 来管理 MapService 的实例，使其在视图生命周期中被正确管理。

2.`Map` 视图:

使用 Map 组件显示地图，并绑定 position 属性到 service.position。
通过 onMapCameraChange 方法监听地图中心位置的变化，并调用 reverseGeoCode 更新地理位置。

3.中心标记图标:

使用 Image(systemName: "mappin") 在地图中心显示一个标记图标。

4.底部视图:
使用 @ViewBuilder 构建底部视图，显示当前地理位置或加载指示器。

逆地理编码功能
在 MapService 中实现了逆地理编码功能。每当地图中心位置发生变化时，调用 reverseGeoCode 方法，将地图中心的坐标转换为人类可读的地址，并更新 UI

### 运行效果

![效果](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d598e9451a3045bf84052d19c02c9aae~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1179&h=2556&s=2329195&e=png&b=f3f0e7)
