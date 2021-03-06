QUnit.module( "JSAppSugar Tests" );

QUnit.test( "Basic Functions Define Test", function( assert ) {
	assert.ok( JSA instanceof Object, "JSA Object Defined" );
	assert.ok( $class instanceof Function, "$class Defined" );
});

QUnit.test( "Basic Object-Oriented Syntax Test", function( assert ) {

	$class("test.AClass",{
		$init:function(a){
			if(a){
				this.a = a;
			}
		},
		a:"-",
		f1:function(){
			return "1a";
		},
		f2:function(){
			return "2a";
		},
	});
	$class("test.BClass",{
		$extends:'test.AClass',
		$init:function(a,b){
			$super(a);
			if(b){
				this.b = b;
			}
		},
		b:'-'
	});
	$class("test.CClass",{
		$extends:'test.BClass',
		$init:function(a,b,c){
			$super(a,b);
			if(c){
				this.c = c;
			}
		},
		c:'-',
		f1:function(){
			let s = $super.f1();
			return s+"1c";
		},
		f2:function(){
			let s1 = $super.f1();
			let s2 = $super.f2();
			return s1+s2+"2c";
		},
	});
	$class("test.DClass",{
		$extends:'test.CClass',
		$init:function(a,b,c){
			$super(a,b,c);
		},
		f2:function(){
			let s = $super.f2();
			return s+"2d";
		}
	});
	assert.ok(typeof test.AClass == "function" ,'typeof test.AClass == "function" OK!');
	{
		let aObj = new test.AClass();
		assert.ok(aObj.constructor == test.AClass,"aObj.constructor == test.AClass OK!");
		assert.equal(aObj.a,'-','aObj.a == "-" OK!');
	}

	{
		let aObj = new test.AClass("newA");
		assert.equal(aObj.a,'newA','new test.AClass("newA") OK!');
	}

	{
		let bObj = new test.BClass('a');
		assert.equal(bObj.a,"a",'bObj.a,"a" OK!');
		assert.ok(bObj instanceof jsa.Object
			&& bObj instanceof test.AClass
			&& bObj instanceof test.BClass
			,"Super Class Test OK！");
	}

	{
		let cObj = new test.CClass();
		assert.ok(cObj.a=='-'&&cObj.b=='-'&&cObj.c=='-' ,'Default value OK!');
	}

	{
		let cObj = new test.CClass('a','b','c');
		assert.equal(cObj.c,'c','Default constructor OK！');
		assert.equal(cObj.b,'b','super.constructor OK!');
		assert.equal(cObj.a,'a','super.super.constructor OK');
	}

	{
		let dObj = new test.DClass();
		assert.equal(dObj.f1(),'1a1c','dObj.f1() OK！');
		assert.equal(dObj.f2(),'1a2a2c2d','dObj.f2() OK！');
	}
});

QUnit.test( "Reflect Functions Test", function( assert ) {
	$class("reflect.AClass",{
		$init:function(a,b){
			if(a && b){
				this.a = a+b;
			}
		},
		a:"-",
		$static:{
			A:"a",
			func:function(a){
				return this.A+a;
			}
		}
	});
	{
		let aObj = $newJs("reflect.AClass",["a","b"]);
		assert.equal(aObj.a,'ab','aObj.a="ab" OK！');
		assert.equal(reflect.AClass.func("a"),'aa','reflect.AClass.func="aa" OK！');
		assert.equal($classFunction("reflect.AClass","func",["a"]),'aa','$classFunction="aa" OK！');
	}
});

QUnit.test( "KVO Functions Test", function( assert ) {
	$class("kvo.AClass",{
		a:"-"
	});
	{
		let aObj = new kvo.AClass();
		var o="";
		var n="";
		aObj.watch("a",function(prop, oldValue, newValue){
			o = oldValue;
			n = newValue;
		});
		aObj.a = "1";
		assert.equal(o,'-','o=="-" OK！');
		assert.equal(n,'1','n=="1" OK！');
	}
});

/*
Feature 是一种多重继承机制，允许一个类继承多个Feature类的功能。如果Feature类中存在同名函数，则会被忽略
*/
QUnit.test( "Feature Syntax Test", function( assert ) {
	$class("feature.AClass",{
		a:"a",
		fa:function(){
			return this.a;
		}
	});

	$class("feature.CFeature",{
		c:"c",
		fc:function(){
			return this.c;
		},
		fb : function() {
			return "fb";
		}
	});

	$class("feature.BClass",{
		$extends:'feature.AClass',
		$feature:["feature.CFeature"],
		b:'b',
		fb:function(){
			return this.b;
		}
	});

	var a = new feature.AClass();
	var b = new feature.BClass();
	assert.equal(a.fa(),'a','call funcA OK!');
	assert.equal(b.fb(),'b','call funcB OK!');
	assert.equal(b.fc(),'c','call funcC OK!');
});