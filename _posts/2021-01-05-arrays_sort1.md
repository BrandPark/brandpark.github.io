---
published: true
layout: post
title: "[ JAVA ] Arrays.sort()의 내부 동작(1)"
<!-- date:   2020-12-06 11:56:00 +0900 -->
subtitle: "- DualPivotQuicksort"
categories: ['java']
background: '/img/bg-post.jpg'
sitemap :
  changefreq : daily
  priority : 1.0
---
## 개요
---
알고리즘 공부를 하다 Arrays.sort()와 Collections.sort()의 내부는 어떤 정렬을 사용하는지 궁금해졌다. 공부한 결과부터 말하자면 Arrays.sort는 인자의 타입이 `원시타입(PrimitiveType)`인 경우에는 `DualPivotQuicksort.sort()`가, `Object Type`인 경우에는 `TimSort.sort()`가 사용된다. 이번 포스팅에서는 `DualPivotQuicksort.sort()`에 대해 알아보자. (JAVA 11기준으로 작성하였다.)

&nbsp;

## java.util.Arrays.sort()
---
<p align="center"><img src="{{site.url}}/img/content-img/java/list_sort1.png" style="width:70%" alt="img1"></p>

<p align="center"><img src="{{site.url}}/img/content-img/java/list_sort2.png" style="width:70%" alt="img2"></p>

int타입의 배열을 인자로 호출한 sort메서드이다. 내부적으로 DualPivotQuicksort.sort메서드를 호출한다. 메서드에 대한 설명이 적혀있는데, 해석해보면 기존의 퀵정렬은 이미 많이 정렬되어 있는 배열에 대해서는 분할의 이점을 제대로 살리지 못하기 때문에 최악의 시간복잡도로서 O(n^2)를 갖는다. `DualPivotQuicksort.sort()`는 퀵정렬이 최악의 시간복잡도를 갖게하는 많은 데이터셋들에 대해서도 O(nlogn)을 갖게한다. 하지만 역시 완전히 보장하지는 못한다. 

<p align="center"><img src="{{site.url}}/img/content-img/java/list_sort3.png" style="width:70%" alt="img3"></p>

위는 전역변수들과 `DualPivotQuicksort.sort()`이다. `DualPivotQuickSort.sort()`는 사실 클래스 이름과 다르게 DualPivotQuickSort말고도 MergeSort, InsertionSort, CountingSort를 가지고 있고, 배열에 크기마다 다르게 적용한다. 정렬의 방법을 달리하는 배열의 크기기준은 아래와 같다. 

<p align="center"><img src="{{site.url}}/img/content-img/java/list_sort4.png" style="width:70%" alt="img4"></p>

전역변수들의 설명을 해석해보면 `DualPivotQuicksort.sort()`는 배열의 크기에 따라 다음과 같이 정렬 방법을 다르게 한다는 것을 알 수 있다. (현재 디버깅하고있는 배열의 크기는 QuickSort를 수행하도록 설정했다.)

* 배열의 크기가 286이상일 경우 `MergeSort`를 수행한다.

* 배열의 크기가 286보다 작은 경우 `QuickSort`를 MergeSort보다 우선 수행한다.

* 배열의 크기가 47보다 작은 경우 `InsertionSort`를 QuickSort보다 우선 수행한다.

* `byte배열`의 크기가 29보다 큰 경우 `CountingSort`를 `InsertionSort`보다 우선 수행한다. 

* `short, char 배열`의 크기가 3200보다 큰 경우 `CountingSort`를 `QuickSort`보다 우선 수행한다.

---
> #### 왜 이렇게 나누었을까?

`CountingSort`의 시간복잡도는 `O(n)`으로 나와있는 정렬중 가장 빠르다. 그런데 왜 이렇게 나누었을까? CountingSort는 빠르지만 추가적인 배열을 하나 만들어야 한다. 만약 int타입 배열에 { 1, 10, 1000000 }이 있다면 겨우 3개를 정렬하기 위하여 크기가 최소 1000001인 배열을 만들어야 한다. 정렬해야하는 배열의 크기가 작을 경우 이처럼 비효율적인 상황이 발생하기 때문에 어느정도 크기 이상일 경우에만 사용한다. byte, short, char 배열에서만 사용하는 이유는 이 자료형들은 크기가 작아 배열의 값으로 들어갈 범위가 작다. 따라서 CountingSort를 하기위해 추가하는 배열의 크기가 그만큼 작아지므로 효율이 올라간다.

`QuickSort`와 `MergeSort`도 마찬가지다. MergeSort는 항상 O(nlogn)을 보장하기 때문에 시간복잡도로만 따지면 QuickSort보다 빠르다. 하지만 추가적인 배열을 필요로 하기 때문에 적당한 크기 이상의 배열에만 사용하여 효율을 높인다. 

---

<p align="center"><img src="{{site.url}}/img/content-img/java/list_sort5.png" style="width:70%" alt="img5"></p>

다시 본론으로 돌아가서, 배열의 크기에 맞게 내부로 쭉 들어왔다. 위의 이미지는 `QuickSort`를 수행하는 코드이다. 그림으로 설명해주고 있는데, 우리가 흔히 알고있는 QuickSort와는 다른 점이있다. 하나의 Pivot으로 두 개의 부분으로 분할하는 QuickSort와 달리 Pivot이 하나 더 존재하고 이것이 이름대로 `DualPivotQuicksort`이다. Pivot을 총 두 개를 선정하여 나눔으로써 분할의 이점을 더 높인 알고리즘이라는 것과 기존의 SinglePivotQuicksort보다 더 많은 케이스에 대해서 O(nlogn)을 보장한다는 것까지만 알아두기로 하자. 

다음 포스팅에서는 Arrays.sort()에서 오브젝트 타입에 대한 정렬 방법인 TimSort에 대해서 알아보도록 하겠다.  











