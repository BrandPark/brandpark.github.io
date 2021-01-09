---
published: true
layout: post
title: "[ JAVA ] Comparable과 Comparator (1)"
<!-- date:   2020-12-06 11:56:00 +0900 -->
subtitle: "- Arrays.sort와 Collections.sort"
categories: ['java']
background: '/img/bg-post.jpg'
sitemap :
  changefreq : daily
  priority : 1.0
---
## 개요

지금까지 알아본 바에 의하면 Java에서는 배열에 대한 정렬 메서드인 `Arrays.sort` 제공하는데, 인자로 넘기는 배열의 타입에 따라 내부적으로 알고리즘을 달리했다. `원시타입 배열`을 인자로 넘겼을 때는 `DualPivotQuickSort.sort`를 사용했고 `Object타입 배열`을 넘겼을 때는 `TimSort`를 사용했다. 이에 관한 내용은 지난 [포스팅]({{site.url}}/java/2021/01/05/arrays_sort3.html)에 적어놓았다. 

JAVA에서는 같은 원시타입끼리의 비교가 가능하다. 하지만 Object와 같은 ReferenceType을 Collections.sort와 Arrays.sort는 어떻게 비교하여 정렬 할까? 오늘의 포스팅 주제는 이것이다.

## Collections.sort 내부 동작

Java에서는 배열처럼 객체들을 효율적으로 모을 수 있는 자료구조인 List와 Set, Queue와 같은 `Collection`을 제공한다. 그 중에 배열을 확장 시킨 개념인 List에 대한 정렬메서드로 `Collections.sort`를 제공한다.

Arrays.sort와는 다른 정렬 알고리즘을 사용할까? 결론부터 말하면 그렇지 않다. 아래의 코드는 List에 정의되어있는 sort메서드이다. List는 자신과 같은 데이터를 가진 오브젝트 타입 배열을 복사해내는 `toArray()`를 가지고 있다. 정렬하라는 명령을 받으면 List는 자신을 복사하여 배열을 만든 후 Arrays.sort(:Object[])를 사용하여 정렬시킨다. 그 후 정렬된 배열의 데이터를 하나씩 List의 요소타입으로 형변환하여 치환한다. 

결국 Collections.sort는 정렬의 책임을 Arrays.sort에게 위임하기 때문에 정렬 알고리즘은 같다. 하지만 배열을 확장하여 더 유연하고 사용하기 편한 List를 인자로 받는 만큼 제공하는 메서드가 더 많다. 예를 들어 내림차순 정렬같은 경우 Collections.reverseOrder()를 제공한다. 

<p align="center"><img src="{{site.url}}/img/content-img/java/arrays_sort11.png" style="width:70%" alt="img11"></p>

&nbsp;

## Arrays.sort(:Object[])의 문제점

```java
public class SortTest {
	public static void main(String[] args) {
		IntWrapper [] wraps = {new IntWrapper(1), new IntWrapper(2)};

		Arrays.sort(wraps);
	}
}
class IntWrapper {
	private int value;
	
	public IntWrapper(int value) {
		this.value = value;
	}
}
```

이전 포스팅에서 얼렁뚱땅 넘어간 부분이 있었다. `Arrays.sort(:Object[])를 사용할 때는 배열의 모든 요소가 Comparable을 구현하여 서로 비교할 수 있어야 한다.` 위의 코드는 int타입의 상태값을 가지는 IntWrapper 인스턴스들을 배열로 생성하여 Arrays.sort로 정렬을 하는 간단한 코드이다. 위의 코드는 문제가 없어보이고 실제로 `컴파일이 정상적`으로 완료된다. 하지만 실행을 하는 순간 `ClassCastException`을 맞닥뜨리게 된다.

<p align="center"><img src="{{site.url}}/img/content-img/java/arrays_sort12.png" style="width:90%" alt="img12"></p>

인자로 받은 Object타입의 배열을 `Comparable`로 강제 형변환 후 `compareTo()`를 호출하여 비교를하는데, 우리가 만든 `IntWrapper`는 Comparable을 구현하지 않았고 당연히 `compareTo()`메서드도 없다. 당연히 예외가 발생한다.

Arrays.sort(:Object[])는 컴파일 단계에서 문법적인 오류가 없기에 실행하기 전까지 개발자가 실수 한 것을 알 수가 없다.

`String`과 `Wrapper클래스`는 예외적으로 Comparable을 이미 구현하고 있다. 이 클래스들을 제외하고는 Arrays.sort에 단독인자로 넣지 말아야 할 것이다. 

(JAVA가 왜 아직 이 메서드의 인자타입을 제네릭을 사용하지 않는지는 나도 모르겠다. 혹시 알고 있다면 댓글로 알려주면 감사하겠다^^.)

&nbsp;

## Collections.sort

Comparable과 Comparator를 알아보기 전에 이쯤에서 `Collections.sort`와 비교를 해보자. Arrays.sort는 Object[]를 인자로 받기 때문에 어떤 타입의 배열이든지 받을 수 있었지만, 선택하여 받는 것은 불가능했다. 

그렇기 때문에 개발자의 의도에서 벗어나는 Comparable을 구현하지 않은 인스턴스를 인자로 넘기는 행위도 컴파일 단계에서 잡을 수가 없었다. 메서드의 내부 구현방식을 알고있어야만 실수를 방지할 수 있었다. Collections.sort는 어떨까?

```java
public class SortTest {
	public static void main(String[] args) {
		List<IntWrapper> wraps = new ArrayList<>();
		
		Collections.sort(wraps);	// Compile error발생
	}
}
class IntWrapper  {
	private int value;
	
	public IntWrapper(int value) {
		this.value = value;
	}
	
	public int getValue() { 
		return value; 
	}
}
```
Collections.sort는 다행히 Comparable을 구현하지 않으면 컴파일 단계에서 문법적인 오류가 있다는 것을 알려준다. 

> ### 어떻게 이것이 가능할까?

<p align="center"><img src="{{site.url}}/img/content-img/java/arrays_sort13.png" style="width:90%" alt="img13"></p>

Collections.sort가 정의된 코드이다. 제네릭 타입이 약간 복잡하게 되어있는데 간단히 말하자면 Comparable을 구현한 T를 요소로 가지는 List만이 메서드의 인자로 사용될 수 있다는 의미이다. 이렇게 인자를 제한함으로써 컴파일 단계에서 오류를 잡아낼 수 있게 되었다. 

제네릭이 도입되면서 오랜 골칫덩이었던 부분이 해결되었다. 다소 이해하기 어려워 보이지만 가져다주는 이점이 크기 때문에 제네릭을 잘 모른다면 꼭 공부하기를 바란다.

&nbsp;

## Comparable? Comparator?

원시타입은 기본적으로 비교가 가능하다. Reference Type의 인스턴스들을 정렬하기 위해서는 인스턴스간의 비교가 가능하도록 추가적인 작업을 해줘야한다. JAVA에서는 두 가지 방법을 제공한다.

첫번째 방법은 정렬할 요소들을 `Comparable을 구현`하여 `compareTo()`를 오버라이드하는 것이다. 두번째 방법은 Arrays.sort()의 두번째 인자로 `Comparator`를 익명 클래스 인스턴스로 넣는 것이다. 

(참고로 `String`과 `Wrapper클래스`들은 이미 Comparable을 구현하고 있기 때문에 정렬이 가능하다.)

&nbsp;

> ### Comparable 구현 

이 방법들에 대해서 Arrays.sort와 Collections.sort의 차이는 없으니 Arrays.sort를 예시로 들겠다. 한번 Comparable을 구현하여 `IntWrapper`를 바꿔보자. Wrapper의 정수타입 value를 기준으로 오름차순 정렬을 하고 배열의 요소들을 콘솔에 출력하자.

```java
public class SortTest {
	public static void main(String[] args) {
		IntWrapper [] wraps = {new IntWrapper(2), new IntWrapper(1)};

		Arrays.sort(wraps);

		for(IntWrapper wrap : wraps) {
			System.out.println(wrap.getValue());
		}
	}
}
class IntWrapper implements Comparable<IntWrapper>{
	private int value;
	
	public IntWrapper(int value) {
		this.value = value;
	}
	
	public int getValue() {
		return value; 
	}
	
	@Override
	public int compareTo(IntWrapper o) {
		return this.value - o.value; 
	}
}
```
```
Console
-------------
1
2
```
`Comparable`을 구현하여 IntWrapper인스턴스간의 value값을 빼서 리턴하는 `compareTo()`를 작성하였다. 그 결과 value값을 기준으로 Arrays.sort로 정렬이 가능해졌다. 실행도 에러없이 잘 된다. compareTo()에서 왜 (this.value - o.value)를 리턴하는지 모르는 사람도 있을텐데 Arrays.sort()에서 compareTo()를 호출하여 사용할 때 리턴값이 양수냐 음수냐 0이냐에 따라 요소간의 위치를 바꿀지 말지 결정한다고만 알고 넘어가자. Comparable의 compareTo()에 관한 자세한 내용은 다음 포스팅에서 다루도록 하겠다.


> ### Comparator 구현

```java
public class SortTest {
	public static void main(String[] args) {
		IntWrapper [] wraps = {new IntWrapper(2), new IntWrapper(1)};

		Arrays.sort(wraps, new Comparator<IntWrapper>(){
			@Override
			public int compare(IntWrapper o1, IntWrapper o2) {
				return o1.getValue() - o2.getValue();
			}
		});

		for(IntWrapper wrap : wraps) {
			System.out.println(wrap.getValue());
		}
	}
}
class IntWrapper {
	private int value;
	
	public IntWrapper(int value) {
		this.value = value;
	}
	
	public int getValue() {
		return value; 
	}
}
```
```
console
------
1
2
```
IntWrapper가 Comparable을 구현하지 않지만 비교하는 장치로 `Comparator`를 구현한 익명 클래스 인스턴스를 Arrays.sort의 두번째인자로 넣었고, 오버라이드한 `compare()`가 인스턴스간의 비교가 가능하게 해주고 있다. 왜 `return o1.getValue() - o2.getValue()`했는지는 역시 다음 포스팅에서 다루도록 하겠다.

원시타입 이차배열과 같이 Comparable을 구현하지 못하는 경우 Comparator를 사용해야만 자바에서 제공하는 기본정렬 메서드를 사용할 수 있다. Arrays.sort뿐만아니라 Collections.sort도 사용방법은 똑같기 때문에 마찬가지이다. `Comparator<int[]>`와 같이 제네릭 타입에 일차원 배열형태를 넣어주면 된다. Java에서는 배열을 객체로 인식할 수 있기 때문에 가능하다.

지금까지는 그냥 Timsort라고 불러왔다. 사실 Arrays.sort는 Comparator가 인자로 주어지면 `Timsort`를 부르지만, 없거나 null이 주어지면 `ComparableTimsort`를 부른다. Timsort와 ComparableTimsort의 차이는 비교방식의 차이이다. 사용되는 메서드를 보면 확실히 알 수 있다. 순서대로 `ComparableTimsort`와 `Timsort`이다.

<p align="center"><img src="{{site.url}}/img/content-img/java/arrays_sort12.png" style="width:90%" alt="img12"></p>

<p align="center"><img src="{{site.url}}/img/content-img/java/arrays_sort14.png" style="width:90%" alt="img14"></p>



&nbsp;

## 정리

* Collections.sort는 내부적으로 Arrays.sort를 호출한다. 
  
* Collections는 Arrays보다 편한 메서드를 많이 제공한다.

* ReferenceType의 인자를 비교하기 위해선 정렬하는 요소가 Comparable을 구현하거나 정렬 메서드의 인자에 Comparator를 익명클래스 인스턴스를 넣어줘야 한다.

* Integer와 Character와 같은 Wrapper클래스와 String은 Comparable을 이미 구현하고 있다.

* Arrays.sort는 인자로 Comparator가 주어지면 Timsort를 사용하고 주어지지 않거나 null이 주어진다면 Comparable한 요소로 간주하고 ComparableTimsort를 사용한다. 

* Arrays.sort는 Comparable하지 않은 요소의 배열을 넣어도 컴파일에서 못잡기 때문에 Arrays.sort를 사용해서 Reference Type을 정렬 할 땐 주의가 필요하다.