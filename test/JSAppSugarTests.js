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
			this.$super('$init')(a);
			if(b){
				this.b = b;
			}
		},
		b:'-'
	});
	$class("test.CClass",{
		$extends:'test.BClass',
		$init:function(a,b,c){
			this.$super('$init')(a,b);
			if(c){
				this.c = c;
			}
		},
		c:'-',
		f1:function(){
			let s = this.$super('f1')();
			return s+"1c";
		},
		f2:function(){
			let s1 = this.$super('f1')();
			let s2 = this.$super('f2')();
			return s1+s2+"2c";
		},
	});
	$class("test.DClass",{
		$extends:'test.CClass',
		$init:function(a,b,c){
			this.$super('$init')(a,b,c);
		},
		f2:function(){
			let s = this.$super('f2')();
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
		$init:function(a){
			if(a){
				this.a = a;
			}
		},
		a:"-",
	});
	{
		let aObj = $newClass("reflect.AClass",["a"]);
		assert.equal(aObj.a,'a','aObj.a="a" OK！');
	}
});

