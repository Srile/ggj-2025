var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// node_modules/@wonderlandengine/api/dist/index.js
var __defProp2 = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  for (var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target, i = decorators.length - 1, decorator; i >= 0; i--)
    (decorator = decorators[i]) && (result = (kind ? decorator(target, key, result) : decorator(result)) || result);
  return kind && result && __defProp2(target, key, result), result;
};
var simd = async () => WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 123, 3, 2, 1, 0, 10, 10, 1, 8, 0, 65, 0, 253, 15, 253, 98, 11]));
var threads = () => (async (e) => {
  try {
    return typeof MessageChannel < "u" && new MessageChannel().port1.postMessage(new SharedArrayBuffer(1)), WebAssembly.validate(e);
  } catch {
    return false;
  }
})(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 2, 1, 0, 5, 4, 1, 3, 1, 1, 10, 11, 1, 9, 0, 65, 0, 254, 16, 2, 0, 26, 11]));
var Type = ((Type2) => (Type2[Type2.Native = 0] = "Native", Type2[Type2.Bool = 1] = "Bool", Type2[Type2.Int = 2] = "Int", Type2[Type2.Float = 3] = "Float", Type2[Type2.String = 4] = "String", Type2[Type2.Enum = 5] = "Enum", Type2[Type2.Object = 6] = "Object", Type2[Type2.Mesh = 7] = "Mesh", Type2[Type2.Texture = 8] = "Texture", Type2[Type2.Material = 9] = "Material", Type2[Type2.Animation = 10] = "Animation", Type2[Type2.Skin = 11] = "Skin", Type2[Type2.Color = 12] = "Color", Type2[Type2.Vector2 = 13] = "Vector2", Type2[Type2.Vector3 = 14] = "Vector3", Type2[Type2.Vector4 = 15] = "Vector4", Type2))(Type || {});
var DefaultPropertyCloner = class {
  clone(type, value) {
    switch (type) {
      case 12:
      case 13:
      case 14:
      case 15:
        return value.slice();
      default:
        return value;
    }
  }
};
var defaultPropertyCloner = new DefaultPropertyCloner();
var Property = { bool(defaultValue = false) {
  return { type: 1, default: defaultValue };
}, int(defaultValue = 0) {
  return { type: 2, default: defaultValue };
}, float(defaultValue = 0) {
  return { type: 3, default: defaultValue };
}, string(defaultValue = "") {
  return { type: 4, default: defaultValue };
}, enum(values, defaultValue) {
  return { type: 5, values, default: defaultValue };
}, object(opts) {
  return { type: 6, default: null, required: opts?.required ?? false };
}, mesh(opts) {
  return { type: 7, default: null, required: opts?.required ?? false };
}, texture(opts) {
  return { type: 8, default: null, required: opts?.required ?? false };
}, material(opts) {
  return { type: 9, default: null, required: opts?.required ?? false };
}, animation(opts) {
  return { type: 10, default: null, required: opts?.required ?? false };
}, skin(opts) {
  return { type: 11, default: null, required: opts?.required ?? false };
}, color(r = 0, g = 0, b = 0, a = 1) {
  return { type: 12, default: [r, g, b, a] };
}, vector2(x = 0, y = 0) {
  return { type: 13, default: [x, y] };
}, vector3(x = 0, y = 0, z = 0) {
  return { type: 14, default: [x, y, z] };
}, vector4(x = 0, y = 0, z = 0, w = 0) {
  return { type: 15, default: [x, y, z, w] };
} };
function propertyDecorator(data) {
  return function(target, propertyKey) {
    let ctor = target.constructor;
    ctor.Properties = ctor.hasOwnProperty("Properties") ? ctor.Properties : {}, ctor.Properties[propertyKey] = data;
  };
}
function enumerable() {
  return function(_, __, descriptor) {
    descriptor.enumerable = true;
  };
}
function nativeProperty() {
  return function(target, propertyKey, descriptor) {
    enumerable()(target, propertyKey, descriptor), propertyDecorator({ type: 0 })(target, propertyKey);
  };
}
var property = {};
for (let name in Property)
  property[name] = (...args) => {
    let functor = Property[name];
    return propertyDecorator(functor(...args));
  };
function isString(value) {
  return value === "" ? true : value && (typeof value == "string" || value.constructor === String);
}
function isNumber(value) {
  return value == null ? false : typeof value == "number" || value.constructor === Number;
}
function isImageLike(value) {
  return value instanceof HTMLImageElement || value instanceof HTMLVideoElement || value instanceof HTMLCanvasElement;
}
var Emitter = class {
  _listeners = [];
  _notifying = false;
  _transactions = [];
  add(listener, opts = {}) {
    let { once = false, id = void 0 } = opts, data = { id, once, callback: listener };
    return this._notifying ? (this._transactions.push({ type: 1, data }), this) : (this._listeners.push(data), this);
  }
  push(...listeners) {
    for (let cb of listeners)
      this.add(cb);
    return this;
  }
  once(listener) {
    return this.add(listener, { once: true });
  }
  remove(listener) {
    if (this._notifying)
      return this._transactions.push({ type: 2, data: listener }), this;
    let listeners = this._listeners;
    for (let i = 0; i < listeners.length; ++i) {
      let target = listeners[i];
      (target.callback === listener || target.id === listener) && listeners.splice(i--, 1);
    }
    return this;
  }
  has(listener) {
    let listeners = this._listeners;
    for (let i = 0; i < listeners.length; ++i) {
      let target = listeners[i];
      if (target.callback === listener || target.id === listener)
        return true;
    }
    return false;
  }
  notify(...data) {
    let listeners = this._listeners;
    this._notifying = true;
    for (let i = 0; i < listeners.length; ++i) {
      let listener = listeners[i];
      listener.once && listeners.splice(i--, 1);
      try {
        listener.callback(...data);
      } catch (e) {
        console.error(e);
      }
    }
    this._notifying = false, this._flushTransactions();
  }
  notifyUnsafe(...data) {
    let listeners = this._listeners;
    for (let i = 0; i < listeners.length; ++i) {
      let listener = listeners[i];
      listener.once && listeners.splice(i--, 1), listener.callback(...data);
    }
    this._flushTransactions();
  }
  promise() {
    return new Promise((res, _) => {
      this.once((...args) => {
        args.length > 1 ? res(args) : res(args[0]);
      });
    });
  }
  get listenerCount() {
    return this._listeners.length;
  }
  get isEmpty() {
    return this.listenerCount === 0;
  }
  _flushTransactions() {
    let listeners = this._listeners;
    for (let transaction of this._transactions)
      transaction.type === 1 ? listeners.push(transaction.data) : this.remove(transaction.data);
    this._transactions.length = 0;
  }
};
var RetainEmitterUndefined = {};
var RetainEmitter = class extends Emitter {
  _event = RetainEmitterUndefined;
  _reset;
  add(listener, opts) {
    let immediate = opts?.immediate ?? true;
    return this._event !== RetainEmitterUndefined && immediate && listener(...this._event), super.add(listener, opts), this;
  }
  once(listener, immediate) {
    return this.add(listener, { once: true, immediate });
  }
  notify(...data) {
    this._event = data, super.notify(...data);
  }
  notifyUnsafe(...data) {
    this._event = data, super.notifyUnsafe(...data);
  }
  reset() {
    return this._event = RetainEmitterUndefined, this;
  }
  get data() {
    return this.isDataRetained ? this._event : void 0;
  }
  get isDataRetained() {
    return this._event !== RetainEmitterUndefined;
  }
};
function createDestroyedProxy(host, type) {
  return new Proxy({}, { get(_, param) {
    if (param === "isDestroyed")
      return true;
    throw new Error(`Cannot read '${param}' of destroyed '${type.name}' resource from ${host}`);
  }, set(_, param) {
    throw new Error(`Cannot write '${param}' of destroyed '${type.name}' resource from ${host}`);
  } });
}
var Resource = class {
  _index = -1;
  _id = -1;
  _engine;
  constructor(engine2, index) {
    this._engine = engine2, this._index = index, this._id = index;
  }
  get engine() {
    return this._engine;
  }
  get index() {
    return this._index;
  }
  equals(other) {
    return other ? this._index === other._index : false;
  }
  get isDestroyed() {
    return this._index <= 0;
  }
};
var SceneResource = class _SceneResource {
  static _pack(scene, index) {
    return scene << 22 | index;
  }
  _index = -1;
  _id = -1;
  _scene;
  constructor(scene, index) {
    this._scene = scene, this._index = index, this._id = _SceneResource._pack(scene._index, index);
  }
  equals(other) {
    return other ? this._id === other._id : false;
  }
  get scene() {
    return this._scene;
  }
  get engine() {
    return this._scene.engine;
  }
  get index() {
    return this._index;
  }
  get isDestroyed() {
    return this._id <= 0;
  }
};
var ResourceManager = class {
  _host;
  _cache = [];
  _template;
  _destructor = null;
  _engine;
  constructor(host, Class) {
    this._host = host, this._template = Class, this._engine = host.engine ?? host;
  }
  wrap(index) {
    return index <= 0 ? null : this._cache[index] ?? (this._cache[index] = new this._template(this._host, index));
  }
  get(index) {
    return this._cache[index] ?? null;
  }
  get allocatedCount() {
    return this._cache.length;
  }
  get count() {
    let count = 0;
    for (let res of this._cache)
      res && res.index >= 0 && ++count;
    return count;
  }
  get engine() {
    return this._engine;
  }
  _destroy(instance) {
    let index = instance.index;
    instance._index = -1, instance._id = -1, this._cache[index] = null, this.engine.erasePrototypeOnDestroy && (this._destructor || (this._destructor = createDestroyedProxy(this._host, this._template)), Object.setPrototypeOf(instance, this._destructor));
  }
  _clear() {
    if (this.engine.erasePrototypeOnDestroy) {
      for (let i = 0; i < this._cache.length; ++i) {
        let instance = this._cache[i];
        instance && this._destroy(instance);
      }
      this._cache.length = 0;
    }
  }
};
var ComponentManagers = class {
  animation = -1;
  collision = -1;
  js = -1;
  physx = -1;
  view = -1;
  _cache = [];
  _constructors;
  _nativeManagers = /* @__PURE__ */ new Map();
  _scene;
  constructor(scene) {
    this._scene = scene;
    let wasm = this._scene.engine.wasm, native = [AnimationComponent, CollisionComponent, InputComponent, LightComponent, MeshComponent, PhysXComponent, TextComponent, ViewComponent];
    this._cache = new Array(native.length), this._constructors = new Array(native.length);
    for (let Class of native) {
      let ptr2 = wasm.tempUTF8(Class.TypeName), manager = wasm._wl_scene_get_component_manager_index(scene._index, ptr2);
      this._constructors, this._constructors[manager] = Class, this._cache[manager] = [], this._nativeManagers.set(Class.TypeName, manager);
    }
    this.animation = this._nativeManagers.get(AnimationComponent.TypeName), this.collision = this._nativeManagers.get(CollisionComponent.TypeName), this.physx = this._nativeManagers.get(PhysXComponent.TypeName), this.view = this._nativeManagers.get(ViewComponent.TypeName);
    let ptr = wasm.tempUTF8("js");
    this.js = wasm._wl_scene_get_component_manager_index(scene._index, ptr), this._cache[this.js] = [];
  }
  createJs(index, id, type, object) {
    let ctor = this._scene.engine.wasm._componentTypes[type];
    if (!ctor)
      throw new Error(`Type index ${type} isn't registered`);
    let log = this._scene.engine.log, component = null;
    try {
      component = new ctor(this._scene, this.js, id);
    } catch (e) {
      log.error(2, `Exception during instantiation of component ${ctor.TypeName}`), log.error(2, e), component = new BrokenComponent(this._scene);
    }
    component._object = this._scene.wrap(object);
    try {
      component.resetProperties();
    } catch (e) {
      log.error(2, `Exception during ${component.type} resetProperties() on object ${component.object.name}`), log.error(2, e);
    }
    return this._scene._jsComponents[index] = component, this._cache[this.js][id] = component, component;
  }
  get(manager, id) {
    return this._cache[manager][id] ?? null;
  }
  wrapAnimation(id) {
    return this.wrapNative(this.animation, id);
  }
  wrapCollision(id) {
    return this.wrapNative(this.collision, id);
  }
  wrapView(id) {
    return this.wrapNative(this.view, id);
  }
  wrapPhysx(id) {
    return this.wrapNative(this.physx, id);
  }
  wrapNative(manager, id) {
    if (id < 0)
      return null;
    let cache = this._cache[manager];
    if (cache[id])
      return cache[id];
    let scene = this._scene, Class = this._constructors[manager], component = new Class(scene, manager, id);
    return cache[id] = component, component;
  }
  wrapAny(manager, id) {
    if (id < 0)
      return null;
    if (manager === this.js) {
      let found = this._cache[this.js][id];
      if (!found)
        throw new Error("JS components must always be cached");
      return found.constructor !== BrokenComponent ? found : null;
    }
    return this.wrapNative(manager, id);
  }
  getNativeManager(name) {
    let manager = this._nativeManagers.get(name);
    return manager !== void 0 ? manager : null;
  }
  destroy(instance) {
    let localId = instance._localId, manager = instance._manager;
    instance._id = -1, instance._localId = -1, instance._manager = -1, this._scene.engine.erasePrototypeOnDestroy && instance && Object.setPrototypeOf(instance, DestroyedComponentInstance), this._cache[manager][localId] = null;
  }
  get managersCount() {
    return this._nativeManagers.size + 1;
  }
};
var FetchProgressTransformer = class {
  #progress = 0;
  #callback;
  #totalSize;
  constructor(callback, totalSize = 0) {
    this.#callback = callback, this.#totalSize = totalSize;
  }
  transform(chunk, controller) {
    controller.enqueue(chunk), this.#progress += chunk.length, this.#totalSize > 0 && this.#callback(this.#progress, this.#totalSize);
  }
  flush() {
    this.#callback(this.#progress, this.#progress);
  }
};
var ArrayBufferSink = class {
  #buffer;
  #offset = 0;
  constructor(size = 0) {
    this.#buffer = new Uint8Array(size);
  }
  get arrayBuffer() {
    let arrayBuffer = this.#buffer.buffer;
    return this.#offset < arrayBuffer.byteLength ? arrayBuffer.slice(0, this.#offset) : arrayBuffer;
  }
  write(chunk) {
    let newLength = this.#offset + chunk.length;
    if (newLength > this.#buffer.length) {
      let newBuffer = new Uint8Array(Math.max(this.#buffer.length * 1.5, newLength));
      newBuffer.set(this.#buffer), this.#buffer = newBuffer;
    }
    this.#buffer.set(chunk, this.#offset), this.#offset = newLength;
  }
};
var ArrayBufferSource = class {
  #buffer;
  constructor(buffer) {
    this.#buffer = buffer;
  }
  start(controller) {
    this.#buffer.byteLength > 0 && controller.enqueue(new Uint8Array(this.#buffer)), controller.close();
  }
};
async function fetchWithProgress(path, onProgress, signal) {
  let res = await fetch(path, { signal });
  if (!res.ok)
    throw res.statusText;
  if (!onProgress || !res.body)
    return res.arrayBuffer();
  let size = Number(res.headers.get("Content-Length") ?? 0);
  Number.isNaN(size) && (size = 0);
  let sink = new ArrayBufferSink(size);
  return await res.body.pipeThrough(new TransformStream(new FetchProgressTransformer(onProgress, size))).pipeTo(new WritableStream(sink)), sink.arrayBuffer;
}
async function fetchStreamWithProgress(path, onProgress, signal) {
  let res = await fetch(path, { signal });
  if (!res.ok)
    throw res.statusText;
  let body = res.body ?? new ReadableStream(), size = Number(res.headers.get("Content-Length") ?? 0);
  return Number.isNaN(size) && (size = 0), onProgress ? body.pipeThrough(new TransformStream(new FetchProgressTransformer(onProgress, size))) : body;
}
function getBaseUrl(url) {
  return url.substring(0, url.lastIndexOf("/"));
}
function getFilename(url) {
  url.endsWith("/") && (url = url.substring(0, url.lastIndexOf("/")));
  let lastSlash = url.lastIndexOf("/");
  return lastSlash < 0 ? url : url.substring(lastSlash + 1);
}
function onImageReady(image) {
  return new Promise((res, rej) => {
    if (image instanceof HTMLCanvasElement)
      res(image);
    else if (image instanceof HTMLVideoElement) {
      if (image.readyState >= 2) {
        res(image);
        return;
      }
      image.addEventListener("loadeddata", () => {
        image.readyState >= 2 && res(image);
      }, { once: true });
      return;
    } else if (image.complete) {
      res(image);
      return;
    }
    image.addEventListener("load", () => res(image), { once: true }), image.addEventListener("error", rej, { once: true });
  });
}
var Prefab = class _Prefab {
  static makeUrlLoadOptions(options) {
    return isString(options) ? { url: options } : options;
  }
  static async loadBuffer(options, progress) {
    let opts = _Prefab.makeUrlLoadOptions(options), buffer = await fetchWithProgress(opts.url, progress, opts.signal), baseURL = getBaseUrl(opts.url), filename = getFilename(opts.url);
    return { ...opts, buffer, baseURL, filename };
  }
  static async loadStream(options, progress) {
    let opts = _Prefab.makeUrlLoadOptions(options), stream = await fetchStreamWithProgress(opts.url, progress, opts.signal), baseURL = getBaseUrl(opts.url), filename = getFilename(opts.url);
    return { ...opts, stream, baseURL, filename };
  }
  static validateBufferOptions(options) {
    let { buffer, baseURL, filename = "scene.bin" } = options;
    if (!buffer)
      throw new Error("missing 'buffer' in options");
    if (!isString(baseURL))
      throw new Error("missing 'baseURL' in options");
    let url = baseURL ? `${baseURL}/${filename}` : filename;
    return { buffer, baseURL, url };
  }
  static validateStreamOptions(options) {
    let { stream, baseURL, filename = "scene.bin" } = options;
    if (!stream)
      throw new Error("missing 'stream' in options");
    if (!isString(baseURL))
      throw new Error("missing 'baseURL' in options");
    let url = baseURL ? `${baseURL}/${filename}` : filename;
    return { stream, baseURL, url };
  }
  _index;
  _engine;
  _components;
  _jsComponents = [];
  _pxCallbacks = /* @__PURE__ */ new Map();
  _animations;
  _skins;
  _objectCache = [];
  _pendingDestroy = 0;
  constructor(engine2, index) {
    this._engine = engine2, this._index = index, this._components = new ComponentManagers(this), this._animations = new ResourceManager(this, Animation), this._skins = new ResourceManager(this, Skin);
  }
  addChild() {
    return this.wrap(0).addChild();
  }
  addObject(parent = null) {
    if (parent?.markedDestroyed)
      throw new Error(`Failed to add object. ${parent} is marked as destroyed.`);
    return this.assertOrigin(parent), (parent ?? this.wrap(0)).addChild();
  }
  addObjects(count, parent = null, componentCountHint = 0) {
    let parentId = parent ? parent._id : 0;
    this.engine.wasm.requireTempMem(count * 2);
    let actualCount = this.engine.wasm._wl_scene_add_objects(this._index, parentId, count, componentCountHint || 0, this.engine.wasm._tempMem, this.engine.wasm._tempMemSize >> 1), ids = this.engine.wasm._tempMemUint16.subarray(0, actualCount), wrapper = this.wrap.bind(this);
    return Array.from(ids, wrapper);
  }
  reserveObjects(objectCount, componentCountPerType) {
    let wasm = this.engine.wasm;
    componentCountPerType = componentCountPerType || {};
    let names = Object.keys(componentCountPerType), countsPerTypeIndex = wasm._tempMemInt;
    for (let i = 0; i < this._components.managersCount; ++i)
      countsPerTypeIndex[i] = 0;
    for (let name of names) {
      let count = componentCountPerType[name], nativeIndex = this._components.getNativeManager(name);
      countsPerTypeIndex[nativeIndex !== null ? nativeIndex : this._components.js] += count;
    }
    wasm._wl_scene_reserve_objects(this._index, objectCount, wasm._tempMem);
  }
  getChildren(out = new Array(this.childrenCount)) {
    return this.wrap(0).getChildren(out);
  }
  get children() {
    return this.wrap(0).children;
  }
  get childrenCount() {
    let root = this.wrap(0);
    return this.engine.wasm._wl_object_get_children_count(root._id);
  }
  findByName(name, recursive = false) {
    return this.wrap(0).findByName(name, recursive);
  }
  findByNameDirect(name) {
    return this.wrap(0).findByNameDirect(name);
  }
  findByNameRecursive(name) {
    return this.wrap(0).findByNameRecursive(name);
  }
  wrap(objectId) {
    let cache = this._objectCache;
    return cache[objectId] || (cache[objectId] = new Object3D(this, objectId));
  }
  destroy() {
    if (this._pendingDestroy > 0)
      throw new Error("It's forbidden to destroy a scene from onDestroy().");
    this._pxCallbacks.clear(), this.engine._destroyScene(this);
  }
  get isActive() {
    return !!this.engine.wasm._wl_scene_active(this._index);
  }
  get baseURL() {
    let wasm = this.engine.wasm, ptr = wasm._wl_scene_get_baseURL(this._index);
    return ptr ? wasm.UTF8ToString(ptr) : "";
  }
  get filename() {
    let wasm = this.engine.wasm, ptr = wasm._wl_scene_get_filename(this._index);
    return ptr ? wasm.UTF8ToString(ptr) : "";
  }
  get animations() {
    return this._animations;
  }
  get skins() {
    return this._skins;
  }
  get engine() {
    return this._engine;
  }
  get isDestroyed() {
    return this._index < 0;
  }
  toString() {
    return this.isDestroyed ? "Scene(destroyed)" : `Scene('${this.filename}', ${this._index})`;
  }
  assertOrigin(other) {
    if (other && other.scene !== this)
      throw new Error(`Attempt to use ${other} from ${other.scene} in ${this}`);
  }
  _initialize() {
    this.engine.wasm._wl_scene_initialize(this._index);
  }
  _destroyObject(localId) {
    let instance = this._objectCache[localId];
    instance && (instance._id = -1, instance._localId = -1, this.engine.erasePrototypeOnDestroy && instance && Object.setPrototypeOf(instance, DestroyedObjectInstance), this._objectCache[localId] = null);
  }
  _destroyComponent(manager, id) {
    let component = this._components.get(manager, id);
    ++this._pendingDestroy, component?._triggerOnDestroy(), --this._pendingDestroy;
  }
};
function clamp(val, min2, max2) {
  return Math.max(Math.min(max2, val), min2);
}
function capitalizeFirstUTF8(str2) {
  return `${str2[0].toUpperCase()}${str2.substring(1)}`;
}
function createDestroyedProxy2(type) {
  return new Proxy({}, { get(_, param) {
    if (param === "isDestroyed")
      return true;
    throw new Error(`Cannot read '${param}' of destroyed ${type}`);
  }, set(_, param) {
    throw new Error(`Cannot write '${param}' of destroyed ${type}`);
  } });
}
var LogTag = ((LogTag2) => (LogTag2[LogTag2.Engine = 0] = "Engine", LogTag2[LogTag2.Scene = 1] = "Scene", LogTag2[LogTag2.Component = 2] = "Component", LogTag2))(LogTag || {});
var Collider = ((Collider2) => (Collider2[Collider2.Sphere = 0] = "Sphere", Collider2[Collider2.AxisAlignedBox = 1] = "AxisAlignedBox", Collider2[Collider2.Box = 2] = "Box", Collider2))(Collider || {});
var Alignment = ((Alignment2) => (Alignment2[Alignment2.Left = 0] = "Left", Alignment2[Alignment2.Center = 1] = "Center", Alignment2[Alignment2.Right = 2] = "Right", Alignment2))(Alignment || {});
var VerticalAlignment = ((VerticalAlignment2) => (VerticalAlignment2[VerticalAlignment2.Line = 0] = "Line", VerticalAlignment2[VerticalAlignment2.Middle = 1] = "Middle", VerticalAlignment2[VerticalAlignment2.Top = 2] = "Top", VerticalAlignment2[VerticalAlignment2.Bottom = 3] = "Bottom", VerticalAlignment2))(VerticalAlignment || {});
var TextEffect = ((TextEffect2) => (TextEffect2[TextEffect2.None = 0] = "None", TextEffect2[TextEffect2.Outline = 1] = "Outline", TextEffect2))(TextEffect || {});
var TextWrapMode = ((TextWrapMode2) => (TextWrapMode2[TextWrapMode2.None = 0] = "None", TextWrapMode2[TextWrapMode2.Soft = 1] = "Soft", TextWrapMode2[TextWrapMode2.Hard = 2] = "Hard", TextWrapMode2[TextWrapMode2.Clip = 3] = "Clip", TextWrapMode2))(TextWrapMode || {});
var InputType = ((InputType2) => (InputType2[InputType2.Head = 0] = "Head", InputType2[InputType2.EyeLeft = 1] = "EyeLeft", InputType2[InputType2.EyeRight = 2] = "EyeRight", InputType2[InputType2.ControllerLeft = 3] = "ControllerLeft", InputType2[InputType2.ControllerRight = 4] = "ControllerRight", InputType2[InputType2.RayLeft = 5] = "RayLeft", InputType2[InputType2.RayRight = 6] = "RayRight", InputType2))(InputType || {});
var ProjectionType = ((ProjectionType2) => (ProjectionType2[ProjectionType2.Perspective = 0] = "Perspective", ProjectionType2[ProjectionType2.Orthographic = 1] = "Orthographic", ProjectionType2))(ProjectionType || {});
var LightType = ((LightType2) => (LightType2[LightType2.Point = 0] = "Point", LightType2[LightType2.Spot = 1] = "Spot", LightType2[LightType2.Sun = 2] = "Sun", LightType2))(LightType || {});
var AnimationState = ((AnimationState2) => (AnimationState2[AnimationState2.Playing = 0] = "Playing", AnimationState2[AnimationState2.Paused = 1] = "Paused", AnimationState2[AnimationState2.Stopped = 2] = "Stopped", AnimationState2))(AnimationState || {});
var RootMotionMode = ((RootMotionMode2) => (RootMotionMode2[RootMotionMode2.None = 0] = "None", RootMotionMode2[RootMotionMode2.ApplyToOwner = 1] = "ApplyToOwner", RootMotionMode2[RootMotionMode2.Script = 2] = "Script", RootMotionMode2))(RootMotionMode || {});
var ForceMode = ((ForceMode2) => (ForceMode2[ForceMode2.Force = 0] = "Force", ForceMode2[ForceMode2.Impulse = 1] = "Impulse", ForceMode2[ForceMode2.VelocityChange = 2] = "VelocityChange", ForceMode2[ForceMode2.Acceleration = 3] = "Acceleration", ForceMode2))(ForceMode || {});
var CollisionEventType = ((CollisionEventType2) => (CollisionEventType2[CollisionEventType2.Touch = 0] = "Touch", CollisionEventType2[CollisionEventType2.TouchLost = 1] = "TouchLost", CollisionEventType2[CollisionEventType2.TriggerTouch = 2] = "TriggerTouch", CollisionEventType2[CollisionEventType2.TriggerTouchLost = 3] = "TriggerTouchLost", CollisionEventType2))(CollisionEventType || {});
var Shape = ((Shape2) => (Shape2[Shape2.None = 0] = "None", Shape2[Shape2.Sphere = 1] = "Sphere", Shape2[Shape2.Capsule = 2] = "Capsule", Shape2[Shape2.Box = 3] = "Box", Shape2[Shape2.Plane = 4] = "Plane", Shape2[Shape2.ConvexMesh = 5] = "ConvexMesh", Shape2[Shape2.TriangleMesh = 6] = "TriangleMesh", Shape2))(Shape || {});
var MeshAttribute = ((MeshAttribute2) => (MeshAttribute2[MeshAttribute2.Position = 0] = "Position", MeshAttribute2[MeshAttribute2.Tangent = 1] = "Tangent", MeshAttribute2[MeshAttribute2.Normal = 2] = "Normal", MeshAttribute2[MeshAttribute2.TextureCoordinate = 3] = "TextureCoordinate", MeshAttribute2[MeshAttribute2.Color = 4] = "Color", MeshAttribute2[MeshAttribute2.JointId = 5] = "JointId", MeshAttribute2[MeshAttribute2.JointWeight = 6] = "JointWeight", MeshAttribute2))(MeshAttribute || {});
var DestroyedObjectInstance = createDestroyedProxy2("object");
var DestroyedComponentInstance = createDestroyedProxy2("component");
var DestroyedPrefabInstance = createDestroyedProxy2("prefab/scene");
function isMeshShape(shape) {
  return shape === 5 || shape === 6;
}
function isBaseComponentClass(value) {
  return !!value && value.hasOwnProperty("_isBaseComponent") && value._isBaseComponent;
}
var UP_VECTOR = [0, 1, 0];
var SQRT_3 = Math.sqrt(3);
var _a;
var Component3 = (_a = class {
  static _pack(scene, id) {
    return scene << 22 | id;
  }
  static _inheritProperties() {
    inheritProperties(this);
  }
  _manager;
  _id;
  _localId;
  _object;
  _scene;
  constructor(scene, manager = -1, id = -1) {
    this._scene = scene, this._manager = manager, this._localId = id, this._id = _a._pack(scene._index, id), this._object = null;
  }
  get scene() {
    return this._scene;
  }
  get engine() {
    return this._scene.engine;
  }
  get type() {
    return this.constructor.TypeName;
  }
  get object() {
    if (!this._object) {
      let objectId = this.engine.wasm._wl_component_get_object(this._manager, this._id);
      this._object = this._scene.wrap(objectId);
    }
    return this._object;
  }
  set active(active) {
    this.engine.wasm._wl_component_setActive(this._manager, this._id, active);
  }
  get active() {
    return this.markedActive && this._scene.isActive;
  }
  get markedActive() {
    return this.engine.wasm._wl_component_isActive(this._manager, this._id) != 0;
  }
  copy(src) {
    let properties = this.constructor.Properties;
    if (!properties)
      return this;
    for (let name in properties) {
      let property2 = properties[name], value = src[name];
      if (value === void 0)
        continue;
      let cloner = property2.cloner ?? defaultPropertyCloner;
      this[name] = cloner.clone(property2.type, value);
    }
    return this;
  }
  destroy() {
    let manager = this._manager;
    manager < 0 || this._id < 0 || this.engine.wasm._wl_component_remove(manager, this._id);
  }
  equals(otherComponent) {
    return otherComponent ? this._manager === otherComponent._manager && this._id === otherComponent._id : false;
  }
  resetProperties() {
    let properties = this.constructor.Properties;
    if (!properties)
      return this;
    for (let name in properties) {
      let property2 = properties[name], cloner = property2.cloner ?? defaultPropertyCloner;
      this[name] = cloner.clone(property2.type, property2.default);
    }
    return this;
  }
  reset() {
    return this.resetProperties();
  }
  validateProperties() {
    let ctor = this.constructor;
    if (ctor.Properties) {
      for (let name in ctor.Properties)
        if (ctor.Properties[name].required && !this[name])
          throw new Error(`Property '${name}' is required but was not initialized`);
    }
  }
  toString() {
    return this.isDestroyed ? "Component(destroyed)" : `Component('${this.type}', ${this._localId})`;
  }
  get isDestroyed() {
    return this._id < 0;
  }
  _copy(src, offsetsPtr) {
    let wasm = this.engine.wasm, offsets = wasm.HEAPU32, offsetsStart = offsetsPtr >>> 2, destScene = this._scene, ctor = this.constructor;
    for (let name in ctor.Properties) {
      let value = src[name];
      if (value === null) {
        this[name] = null;
        continue;
      }
      let prop = ctor.Properties[name], offset = offsets[offsetsStart + prop.type], retargeted;
      switch (prop.type) {
        case 6: {
          let index = wasm._wl_object_index(value._id), id = wasm._wl_object_id(destScene._index, index + offset);
          retargeted = destScene.wrap(id);
          break;
        }
        case 10:
          retargeted = destScene.animations.wrap(offset + value._index);
          break;
        case 11:
          retargeted = destScene.skins.wrap(offset + value._index);
          break;
        default:
          retargeted = (prop.cloner ?? defaultPropertyCloner).clone(prop.type, value);
          break;
      }
      this[name] = retargeted;
    }
    return this;
  }
  _triggerInit() {
    if (this.init)
      try {
        this.init();
      } catch (e) {
        this.engine.log.error(2, `Exception during ${this.type} init() on object ${this.object.name}`), this.engine.log.error(2, e);
      }
    let oldActivate = this.onActivate;
    this.onActivate = function() {
      this.onActivate = oldActivate;
      let failed = false;
      try {
        this.validateProperties();
      } catch (e) {
        this.engine.log.error(2, `Exception during ${this.type} validateProperties() on object ${this.object.name}`), this.engine.log.error(2, e), failed = true;
      }
      try {
        this.start?.();
      } catch (e) {
        this.engine.log.error(2, `Exception during ${this.type} start() on object ${this.object.name}`), this.engine.log.error(2, e), failed = true;
      }
      if (failed) {
        this.active = false;
        return;
      }
      if (this.onActivate)
        try {
          this.onActivate();
        } catch (e) {
          this.engine.log.error(2, `Exception during ${this.type} onActivate() on object ${this.object.name}`), this.engine.log.error(2, e);
        }
    };
  }
  _triggerUpdate(dt) {
    if (this.update)
      try {
        this.update(dt);
      } catch (e) {
        this.engine.log.error(2, `Exception during ${this.type} update() on object ${this.object.name}`), this.engine.log.error(2, e), this.engine.wasm._deactivate_component_on_error && (this.active = false);
      }
  }
  _triggerOnActivate() {
    if (this.onActivate)
      try {
        this.onActivate();
      } catch (e) {
        this.engine.log.error(2, `Exception during ${this.type} onActivate() on object ${this.object.name}`), this.engine.log.error(2, e);
      }
  }
  _triggerOnDeactivate() {
    if (this.onDeactivate)
      try {
        this.onDeactivate();
      } catch (e) {
        this.engine.log.error(2, `Exception during ${this.type} onDeactivate() on object ${this.object.name}`), this.engine.log.error(2, e);
      }
  }
  _triggerOnDestroy() {
    try {
      this.onDestroy && this.onDestroy();
    } catch (e) {
      this.engine.log.error(2, `Exception during ${this.type} onDestroy() on object ${this.object.name}`), this.engine.log.error(2, e);
    }
    this._scene._components.destroy(this);
  }
}, __publicField(_a, "_isBaseComponent", true), __publicField(_a, "_propertyOrder", []), __publicField(_a, "TypeName"), __publicField(_a, "Properties"), __publicField(_a, "InheritProperties"), __publicField(_a, "onRegister"), _a);
var _a2;
var BrokenComponent = (_a2 = class extends Component3 {
}, __publicField(_a2, "TypeName", "__broken-component__"), _a2);
function inheritProperties(target) {
  if (!target.TypeName)
    return;
  let chain = [], curr = target;
  for (; curr && !isBaseComponentClass(curr); ) {
    let comp = curr;
    if (!(comp.hasOwnProperty("InheritProperties") ? comp.InheritProperties : true))
      break;
    comp.hasOwnProperty("Properties") && chain.push(comp), curr = Object.getPrototypeOf(curr);
  }
  if (!chain.length || chain.length === 1 && chain[0] === target)
    return;
  let merged = {};
  for (let i = chain.length - 1; i >= 0; --i)
    Object.assign(merged, chain[i].Properties);
  target.Properties = merged;
}
var _a3;
var CollisionComponent = (_a3 = class extends Component3 {
  getExtents(out = new Float32Array(3)) {
    let wasm = this.engine.wasm, ptr = wasm._wl_collision_component_get_extents(this._id) / 4;
    return out[0] = wasm.HEAPF32[ptr], out[1] = wasm.HEAPF32[ptr + 1], out[2] = wasm.HEAPF32[ptr + 2], out;
  }
  get collider() {
    return this.engine.wasm._wl_collision_component_get_collider(this._id);
  }
  set collider(collider) {
    this.engine.wasm._wl_collision_component_set_collider(this._id, collider);
  }
  get extents() {
    let wasm = this.engine.wasm;
    return new Float32Array(wasm.HEAPF32.buffer, wasm._wl_collision_component_get_extents(this._id), 3);
  }
  set extents(extents) {
    let wasm = this.engine.wasm, ptr = wasm._wl_collision_component_get_extents(this._id) / 4;
    wasm.HEAPF32[ptr] = extents[0], wasm.HEAPF32[ptr + 1] = extents[1], wasm.HEAPF32[ptr + 2] = extents[2];
  }
  get radius() {
    let wasm = this.engine.wasm;
    if (this.collider === 0)
      return wasm.HEAPF32[wasm._wl_collision_component_get_extents(this._id) >> 2];
    let extents = new Float32Array(wasm.HEAPF32.buffer, wasm._wl_collision_component_get_extents(this._id), 3), x2 = extents[0] * extents[0], y2 = extents[1] * extents[1], z2 = extents[2] * extents[2];
    return Math.sqrt(x2 + y2 + z2) / 2;
  }
  set radius(radius) {
    let length2 = this.collider === 0 ? radius : 2 * radius / SQRT_3;
    this.extents.set([length2, length2, length2]);
  }
  get group() {
    return this.engine.wasm._wl_collision_component_get_group(this._id);
  }
  set group(group) {
    this.engine.wasm._wl_collision_component_set_group(this._id, group);
  }
  queryOverlaps() {
    let count = this.engine.wasm._wl_collision_component_query_overlaps(this._id, this.engine.wasm._tempMem, this.engine.wasm._tempMemSize >> 1), overlaps = new Array(count);
    for (let i = 0; i < count; ++i) {
      let id = this.engine.wasm._tempMemUint16[i];
      overlaps[i] = this._scene._components.wrapCollision(id);
    }
    return overlaps;
  }
}, __publicField(_a3, "TypeName", "collision"), _a3);
__decorateClass([nativeProperty()], CollisionComponent.prototype, "collider", 1), __decorateClass([nativeProperty()], CollisionComponent.prototype, "extents", 1), __decorateClass([nativeProperty()], CollisionComponent.prototype, "group", 1);
var _a4;
var TextComponent = (_a4 = class extends Component3 {
  get alignment() {
    return this.engine.wasm._wl_text_component_get_horizontal_alignment(this._id);
  }
  set alignment(alignment) {
    this.engine.wasm._wl_text_component_set_horizontal_alignment(this._id, alignment);
  }
  get verticalAlignment() {
    return this.engine.wasm._wl_text_component_get_vertical_alignment(this._id);
  }
  set verticalAlignment(verticalAlignment) {
    this.engine.wasm._wl_text_component_set_vertical_alignment(this._id, verticalAlignment);
  }
  get justification() {
    return this.verticalAlignment;
  }
  set justification(justification) {
    this.verticalAlignment = justification;
  }
  get characterSpacing() {
    return this.engine.wasm._wl_text_component_get_character_spacing(this._id);
  }
  set characterSpacing(spacing) {
    this.engine.wasm._wl_text_component_set_character_spacing(this._id, spacing);
  }
  get lineSpacing() {
    return this.engine.wasm._wl_text_component_get_line_spacing(this._id);
  }
  set lineSpacing(spacing) {
    this.engine.wasm._wl_text_component_set_line_spacing(this._id, spacing);
  }
  get effect() {
    return this.engine.wasm._wl_text_component_get_effect(this._id);
  }
  set effect(effect) {
    this.engine.wasm._wl_text_component_set_effect(this._id, effect);
  }
  get wrapMode() {
    return this.engine.wasm._wl_text_component_get_wrapMode(this._id);
  }
  set wrapMode(wrapMode) {
    this.engine.wasm._wl_text_component_set_wrapMode(this._id, wrapMode);
  }
  get wrapWidth() {
    return this.engine.wasm._wl_text_component_get_wrapWidth(this._id);
  }
  set wrapWidth(width) {
    this.engine.wasm._wl_text_component_set_wrapWidth(this._id, width);
  }
  get text() {
    let wasm = this.engine.wasm, ptr = wasm._wl_text_component_get_text(this._id);
    return wasm.UTF8ToString(ptr);
  }
  set text(text) {
    let wasm = this.engine.wasm;
    wasm._wl_text_component_set_text(this._id, wasm.tempUTF8(text.toString()));
  }
  set material(material) {
    let matIndex = material ? material._id : 0;
    this.engine.wasm._wl_text_component_set_material(this._id, matIndex);
  }
  get material() {
    let index = this.engine.wasm._wl_text_component_get_material(this._id);
    return this.engine.materials.wrap(index);
  }
  getBoundingBoxForText(text, out = new Float32Array(4)) {
    let wasm = this.engine.wasm, textPtr = wasm.tempUTF8(text, 4 * 4);
    return this.engine.wasm._wl_text_component_get_boundingBox(this._id, textPtr, wasm._tempMem), out[0] = wasm._tempMemFloat[0], out[1] = wasm._tempMemFloat[1], out[2] = wasm._tempMemFloat[2], out[3] = wasm._tempMemFloat[3], out;
  }
  getBoundingBox(out = new Float32Array(4)) {
    let wasm = this.engine.wasm;
    return this.engine.wasm._wl_text_component_get_boundingBox(this._id, 0, wasm._tempMem), out[0] = wasm._tempMemFloat[0], out[1] = wasm._tempMemFloat[1], out[2] = wasm._tempMemFloat[2], out[3] = wasm._tempMemFloat[3], out;
  }
}, __publicField(_a4, "TypeName", "text"), _a4);
__decorateClass([nativeProperty()], TextComponent.prototype, "alignment", 1), __decorateClass([nativeProperty()], TextComponent.prototype, "verticalAlignment", 1), __decorateClass([nativeProperty()], TextComponent.prototype, "justification", 1), __decorateClass([nativeProperty()], TextComponent.prototype, "characterSpacing", 1), __decorateClass([nativeProperty()], TextComponent.prototype, "lineSpacing", 1), __decorateClass([nativeProperty()], TextComponent.prototype, "effect", 1), __decorateClass([nativeProperty()], TextComponent.prototype, "wrapMode", 1), __decorateClass([nativeProperty()], TextComponent.prototype, "wrapWidth", 1), __decorateClass([nativeProperty()], TextComponent.prototype, "text", 1), __decorateClass([nativeProperty()], TextComponent.prototype, "material", 1);
var _a5;
var ViewComponent = (_a5 = class extends Component3 {
  get projectionType() {
    return this.engine.wasm._wl_view_component_get_projectionType(this._id);
  }
  set projectionType(type) {
    this.engine.wasm._wl_view_component_set_projectionType(this._id, type);
  }
  getProjectionMatrix(out = new Float32Array(16)) {
    let wasm = this.engine.wasm, ptr = wasm._wl_view_component_get_projection_matrix(this._id) / 4;
    for (let i = 0; i < 16; ++i)
      out[i] = wasm.HEAPF32[ptr + i];
    return out;
  }
  get projectionMatrix() {
    let wasm = this.engine.wasm;
    return new Float32Array(wasm.HEAPF32.buffer, wasm._wl_view_component_get_projection_matrix(this._id), 16);
  }
  get near() {
    return this.engine.wasm._wl_view_component_get_near(this._id);
  }
  set near(near) {
    this.engine.wasm._wl_view_component_set_near(this._id, near);
  }
  get far() {
    return this.engine.wasm._wl_view_component_get_far(this._id);
  }
  set far(far) {
    this.engine.wasm._wl_view_component_set_far(this._id, far);
  }
  get fov() {
    return this.engine.wasm._wl_view_component_get_fov(this._id);
  }
  set fov(fov) {
    this.engine.wasm._wl_view_component_set_fov(this._id, fov);
  }
  get extent() {
    return this.engine.wasm._wl_view_component_get_extent(this._id);
  }
  set extent(extent) {
    this.engine.wasm._wl_view_component_set_extent(this._id, extent);
  }
}, __publicField(_a5, "TypeName", "view"), _a5);
__decorateClass([nativeProperty()], ViewComponent.prototype, "projectionType", 1), __decorateClass([enumerable()], ViewComponent.prototype, "projectionMatrix", 1), __decorateClass([nativeProperty()], ViewComponent.prototype, "near", 1), __decorateClass([nativeProperty()], ViewComponent.prototype, "far", 1), __decorateClass([nativeProperty()], ViewComponent.prototype, "fov", 1), __decorateClass([nativeProperty()], ViewComponent.prototype, "extent", 1);
var _a6;
var InputComponent = (_a6 = class extends Component3 {
  get inputType() {
    return this.engine.wasm._wl_input_component_get_type(this._id);
  }
  set inputType(type) {
    this.engine.wasm._wl_input_component_set_type(this._id, type);
  }
  get xrInputSource() {
    let xr = this.engine.xr;
    if (!xr)
      return null;
    for (let inputSource of xr.session.inputSources)
      if (inputSource.handedness == this.handedness)
        return inputSource;
    return null;
  }
  get handedness() {
    let inputType = this.inputType;
    return inputType == 4 || inputType == 6 || inputType == 2 ? "right" : inputType == 3 || inputType == 5 || inputType == 1 ? "left" : null;
  }
}, __publicField(_a6, "TypeName", "input"), _a6);
__decorateClass([nativeProperty()], InputComponent.prototype, "inputType", 1), __decorateClass([enumerable()], InputComponent.prototype, "xrInputSource", 1), __decorateClass([enumerable()], InputComponent.prototype, "handedness", 1);
var _a7;
var LightComponent = (_a7 = class extends Component3 {
  getColor(out = new Float32Array(3)) {
    let wasm = this.engine.wasm, ptr = wasm._wl_light_component_get_color(this._id) / 4;
    return out[0] = wasm.HEAPF32[ptr], out[1] = wasm.HEAPF32[ptr + 1], out[2] = wasm.HEAPF32[ptr + 2], out;
  }
  setColor(c) {
    let wasm = this.engine.wasm, ptr = wasm._wl_light_component_get_color(this._id) / 4;
    wasm.HEAPF32[ptr] = c[0], wasm.HEAPF32[ptr + 1] = c[1], wasm.HEAPF32[ptr + 2] = c[2];
  }
  get color() {
    let wasm = this.engine.wasm;
    return new Float32Array(wasm.HEAPF32.buffer, wasm._wl_light_component_get_color(this._id), 3);
  }
  set color(c) {
    this.color.set(c);
  }
  get lightType() {
    return this.engine.wasm._wl_light_component_get_type(this._id);
  }
  set lightType(t) {
    this.engine.wasm._wl_light_component_set_type(this._id, t);
  }
  get intensity() {
    return this.engine.wasm._wl_light_component_get_intensity(this._id);
  }
  set intensity(intensity) {
    this.engine.wasm._wl_light_component_set_intensity(this._id, intensity);
  }
  get outerAngle() {
    return this.engine.wasm._wl_light_component_get_outerAngle(this._id);
  }
  set outerAngle(angle2) {
    this.engine.wasm._wl_light_component_set_outerAngle(this._id, angle2);
  }
  get innerAngle() {
    return this.engine.wasm._wl_light_component_get_innerAngle(this._id);
  }
  set innerAngle(angle2) {
    this.engine.wasm._wl_light_component_set_innerAngle(this._id, angle2);
  }
  get shadows() {
    return !!this.engine.wasm._wl_light_component_get_shadows(this._id);
  }
  set shadows(b) {
    this.engine.wasm._wl_light_component_set_shadows(this._id, b);
  }
  get shadowRange() {
    return this.engine.wasm._wl_light_component_get_shadowRange(this._id);
  }
  set shadowRange(range) {
    this.engine.wasm._wl_light_component_set_shadowRange(this._id, range);
  }
  get shadowBias() {
    return this.engine.wasm._wl_light_component_get_shadowBias(this._id);
  }
  set shadowBias(bias) {
    this.engine.wasm._wl_light_component_set_shadowBias(this._id, bias);
  }
  get shadowNormalBias() {
    return this.engine.wasm._wl_light_component_get_shadowNormalBias(this._id);
  }
  set shadowNormalBias(bias) {
    this.engine.wasm._wl_light_component_set_shadowNormalBias(this._id, bias);
  }
  get shadowTexelSize() {
    return this.engine.wasm._wl_light_component_get_shadowTexelSize(this._id);
  }
  set shadowTexelSize(size) {
    this.engine.wasm._wl_light_component_set_shadowTexelSize(this._id, size);
  }
  get cascadeCount() {
    return this.engine.wasm._wl_light_component_get_cascadeCount(this._id);
  }
  set cascadeCount(count) {
    this.engine.wasm._wl_light_component_set_cascadeCount(this._id, count);
  }
}, __publicField(_a7, "TypeName", "light"), _a7);
__decorateClass([nativeProperty()], LightComponent.prototype, "color", 1), __decorateClass([nativeProperty()], LightComponent.prototype, "lightType", 1), __decorateClass([nativeProperty()], LightComponent.prototype, "intensity", 1), __decorateClass([nativeProperty()], LightComponent.prototype, "outerAngle", 1), __decorateClass([nativeProperty()], LightComponent.prototype, "innerAngle", 1), __decorateClass([nativeProperty()], LightComponent.prototype, "shadows", 1), __decorateClass([nativeProperty()], LightComponent.prototype, "shadowRange", 1), __decorateClass([nativeProperty()], LightComponent.prototype, "shadowBias", 1), __decorateClass([nativeProperty()], LightComponent.prototype, "shadowNormalBias", 1), __decorateClass([nativeProperty()], LightComponent.prototype, "shadowTexelSize", 1), __decorateClass([nativeProperty()], LightComponent.prototype, "cascadeCount", 1);
var _a8;
var AnimationComponent = (_a8 = class extends Component3 {
  onEvent = new Emitter();
  set animation(anim) {
    this.scene.assertOrigin(anim), this.engine.wasm._wl_animation_component_set_animation(this._id, anim ? anim._id : 0);
  }
  get animation() {
    let index = this.engine.wasm._wl_animation_component_get_animation(this._id);
    return this._scene.animations.wrap(index);
  }
  set playCount(playCount) {
    this.engine.wasm._wl_animation_component_set_playCount(this._id, playCount);
  }
  get playCount() {
    return this.engine.wasm._wl_animation_component_get_playCount(this._id);
  }
  set speed(speed) {
    this.engine.wasm._wl_animation_component_set_speed(this._id, speed);
  }
  get speed() {
    return this.engine.wasm._wl_animation_component_get_speed(this._id);
  }
  get state() {
    return this.engine.wasm._wl_animation_component_state(this._id);
  }
  get rootMotionMode() {
    return this.engine.wasm._wl_animation_component_get_rootMotionMode(this._id);
  }
  set rootMotionMode(mode) {
    this.engine.wasm._wl_animation_component_set_rootMotionMode(this._id, mode);
  }
  get iteration() {
    return this.engine.wasm._wl_animation_component_get_iteration(this._id);
  }
  get position() {
    return this.engine.wasm._wl_animation_component_get_position(this._id);
  }
  get duration() {
    return this.engine.wasm._wl_animation_component_get_duration(this._id);
  }
  play() {
    this.engine.wasm._wl_animation_component_play(this._id);
  }
  stop() {
    this.engine.wasm._wl_animation_component_stop(this._id);
  }
  pause() {
    this.engine.wasm._wl_animation_component_pause(this._id);
  }
  getFloatParameter(name) {
    let wasm = this.engine.wasm, index = wasm._wl_animation_component_getGraphParamIndex(this._id, wasm.tempUTF8(name));
    if (index === -1)
      throw Error(`Missing parameter '${name}'`);
    return wasm._wl_animation_component_getGraphParamValue(this._id, index, wasm._tempMem), wasm._tempMemFloat[0];
  }
  setFloatParameter(name, value) {
    let wasm = this.engine.wasm, index = wasm._wl_animation_component_getGraphParamIndex(this._id, wasm.tempUTF8(name));
    if (index === -1)
      throw Error(`Missing parameter '${name}'`);
    wasm._tempMemFloat[0] = value, wasm._wl_animation_component_setGraphParamValue(this._id, index, wasm._tempMem);
  }
  getRootMotionTranslation(out = new Float32Array(3)) {
    let wasm = this.engine.wasm;
    return wasm._wl_animation_component_get_rootMotion_translation(this._id, wasm._tempMem), out[0] = wasm._tempMemFloat[0], out[1] = wasm._tempMemFloat[1], out[2] = wasm._tempMemFloat[2], out;
  }
  getRootMotionRotation(out = new Float32Array(3)) {
    let wasm = this.engine.wasm;
    return wasm._wl_animation_component_get_rootMotion_rotation(this._id, wasm._tempMem), out[0] = wasm._tempMemFloat[0], out[1] = wasm._tempMemFloat[1], out[2] = wasm._tempMemFloat[2], out;
  }
}, __publicField(_a8, "TypeName", "animation"), _a8);
__decorateClass([nativeProperty()], AnimationComponent.prototype, "animation", 1), __decorateClass([nativeProperty()], AnimationComponent.prototype, "playCount", 1), __decorateClass([nativeProperty()], AnimationComponent.prototype, "speed", 1), __decorateClass([enumerable()], AnimationComponent.prototype, "state", 1), __decorateClass([nativeProperty(), enumerable()], AnimationComponent.prototype, "rootMotionMode", 1);
var _a9;
var MeshComponent = (_a9 = class extends Component3 {
  set material(material) {
    this.engine.wasm._wl_mesh_component_set_material(this._id, material ? material._id : 0);
  }
  get material() {
    let index = this.engine.wasm._wl_mesh_component_get_material(this._id);
    return this.engine.materials.wrap(index);
  }
  get mesh() {
    let index = this.engine.wasm._wl_mesh_component_get_mesh(this._id);
    return this.engine.meshes.wrap(index);
  }
  set mesh(mesh) {
    this.engine.wasm._wl_mesh_component_set_mesh(this._id, mesh?._id ?? 0);
  }
  get skin() {
    let index = this.engine.wasm._wl_mesh_component_get_skin(this._id);
    return this._scene.skins.wrap(index);
  }
  set skin(skin) {
    this.scene.assertOrigin(skin), this.engine.wasm._wl_mesh_component_set_skin(this._id, skin ? skin._id : 0);
  }
  get morphTargets() {
    let index = this.engine.wasm._wl_mesh_component_get_morph_targets(this._id);
    return this.engine.morphTargets.wrap(index);
  }
  set morphTargets(morphTargets) {
    this.engine.wasm._wl_mesh_component_set_morph_targets(this._id, morphTargets?._id ?? 0);
  }
  get morphTargetWeights() {
    return this.getMorphTargetWeights();
  }
  set morphTargetWeights(weights) {
    this.setMorphTargetWeights(weights);
  }
  getMorphTargetWeights(out) {
    let wasm = this.engine.wasm, count = wasm._wl_mesh_component_get_morph_target_weights(this._id, wasm._tempMem);
    out || (out = new Float32Array(count));
    for (let i = 0; i < count; ++i)
      out[i] = wasm._tempMemFloat[i];
    return out;
  }
  getMorphTargetWeight(target) {
    let count = this.morphTargets?.count ?? 0;
    if (target >= count)
      throw new Error(`Index ${target} is out of bounds for ${count} targets`);
    return this.engine.wasm._wl_mesh_component_get_morph_target_weight(this._id, target);
  }
  setMorphTargetWeights(weights) {
    let count = this.morphTargets?.count ?? 0;
    if (weights.length !== count)
      throw new Error(`Expected ${count} weights but got ${weights.length}`);
    let wasm = this.engine.wasm;
    wasm._tempMemFloat.set(weights), wasm._wl_mesh_component_set_morph_target_weights(this._id, wasm._tempMem, weights.length);
  }
  setMorphTargetWeight(target, weight) {
    let count = this.morphTargets?.count ?? 0;
    if (target >= count)
      throw new Error(`Index ${target} is out of bounds for ${count} targets`);
    this.engine.wasm._wl_mesh_component_set_morph_target_weight(this._id, target, weight);
  }
}, __publicField(_a9, "TypeName", "mesh"), _a9);
__decorateClass([nativeProperty()], MeshComponent.prototype, "material", 1), __decorateClass([nativeProperty()], MeshComponent.prototype, "mesh", 1), __decorateClass([nativeProperty()], MeshComponent.prototype, "skin", 1), __decorateClass([nativeProperty()], MeshComponent.prototype, "morphTargets", 1), __decorateClass([nativeProperty()], MeshComponent.prototype, "morphTargetWeights", 1);
var LockAxis = ((LockAxis2) => (LockAxis2[LockAxis2.None = 0] = "None", LockAxis2[LockAxis2.X = 1] = "X", LockAxis2[LockAxis2.Y = 2] = "Y", LockAxis2[LockAxis2.Z = 4] = "Z", LockAxis2))(LockAxis || {});
var _a10;
var PhysXComponent = (_a10 = class extends Component3 {
  getTranslationOffset(out = new Float32Array(3)) {
    let wasm = this.engine.wasm;
    return wasm._wl_physx_component_get_offsetTranslation(this._id, wasm._tempMem), out[0] = wasm._tempMemFloat[0], out[1] = wasm._tempMemFloat[1], out[2] = wasm._tempMemFloat[2], out;
  }
  getRotationOffset(out = new Float32Array(4)) {
    let wasm = this.engine.wasm, ptr = wasm._wl_physx_component_get_offsetTransform(this._id) >> 2;
    return out[0] = wasm.HEAPF32[ptr], out[1] = wasm.HEAPF32[ptr + 1], out[2] = wasm.HEAPF32[ptr + 2], out[3] = wasm.HEAPF32[ptr + 3], out;
  }
  getExtents(out = new Float32Array(3)) {
    let wasm = this.engine.wasm, ptr = wasm._wl_physx_component_get_extents(this._id) / 4;
    return out[0] = wasm.HEAPF32[ptr], out[1] = wasm.HEAPF32[ptr + 1], out[2] = wasm.HEAPF32[ptr + 2], out;
  }
  getLinearVelocity(out = new Float32Array(3)) {
    let wasm = this.engine.wasm, tempMemFloat = wasm._tempMemFloat;
    return wasm._wl_physx_component_get_linearVelocity(this._id, wasm._tempMem), out[0] = tempMemFloat[0], out[1] = tempMemFloat[1], out[2] = tempMemFloat[2], out;
  }
  getAngularVelocity(out = new Float32Array(3)) {
    let wasm = this.engine.wasm, tempMemFloat = wasm._tempMemFloat;
    return wasm._wl_physx_component_get_angularVelocity(this._id, wasm._tempMem), out[0] = tempMemFloat[0], out[1] = tempMemFloat[1], out[2] = tempMemFloat[2], out;
  }
  set static(b) {
    this.engine.wasm._wl_physx_component_set_static(this._id, b);
  }
  get static() {
    return !!this.engine.wasm._wl_physx_component_get_static(this._id);
  }
  get translationOffset() {
    return this.getTranslationOffset();
  }
  set translationOffset(offset) {
    this.engine.wasm._wl_physx_component_set_offsetTranslation(this._id, offset[0], offset[1], offset[2]);
  }
  get rotationOffset() {
    return this.getRotationOffset();
  }
  set rotationOffset(offset) {
    this.engine.wasm._wl_physx_component_set_offsetRotation(this._id, offset[0], offset[1], offset[2], offset[3]);
  }
  set kinematic(b) {
    this.engine.wasm._wl_physx_component_set_kinematic(this._id, b);
  }
  get kinematic() {
    return !!this.engine.wasm._wl_physx_component_get_kinematic(this._id);
  }
  set gravity(b) {
    this.engine.wasm._wl_physx_component_set_gravity(this._id, b);
  }
  get gravity() {
    return !!this.engine.wasm._wl_physx_component_get_gravity(this._id);
  }
  set simulate(b) {
    this.engine.wasm._wl_physx_component_set_simulate(this._id, b);
  }
  get simulate() {
    return !!this.engine.wasm._wl_physx_component_get_simulate(this._id);
  }
  set allowSimulation(b) {
    this.engine.wasm._wl_physx_component_set_allowSimulation(this._id, b);
  }
  get allowSimulation() {
    return !!this.engine.wasm._wl_physx_component_get_allowSimulation(this._id);
  }
  set allowQuery(b) {
    this.engine.wasm._wl_physx_component_set_allowQuery(this._id, b);
  }
  get allowQuery() {
    return !!this.engine.wasm._wl_physx_component_get_allowQuery(this._id);
  }
  set trigger(b) {
    this.engine.wasm._wl_physx_component_set_trigger(this._id, b);
  }
  get trigger() {
    return !!this.engine.wasm._wl_physx_component_get_trigger(this._id);
  }
  set shape(s) {
    this.engine.wasm._wl_physx_component_set_shape(this._id, s);
  }
  get shape() {
    return this.engine.wasm._wl_physx_component_get_shape(this._id);
  }
  set shapeData(d) {
    d == null || !isMeshShape(this.shape) || this.engine.wasm._wl_physx_component_set_shape_data(this._id, d.index);
  }
  get shapeData() {
    return isMeshShape(this.shape) ? { index: this.engine.wasm._wl_physx_component_get_shape_data(this._id) } : null;
  }
  set extents(e) {
    this.extents.set(e);
  }
  get extents() {
    let wasm = this.engine.wasm, ptr = wasm._wl_physx_component_get_extents(this._id);
    return new Float32Array(wasm.HEAPF32.buffer, ptr, 3);
  }
  get staticFriction() {
    return this.engine.wasm._wl_physx_component_get_staticFriction(this._id);
  }
  set staticFriction(v) {
    this.engine.wasm._wl_physx_component_set_staticFriction(this._id, v);
  }
  get dynamicFriction() {
    return this.engine.wasm._wl_physx_component_get_dynamicFriction(this._id);
  }
  set dynamicFriction(v) {
    this.engine.wasm._wl_physx_component_set_dynamicFriction(this._id, v);
  }
  get bounciness() {
    return this.engine.wasm._wl_physx_component_get_bounciness(this._id);
  }
  set bounciness(v) {
    this.engine.wasm._wl_physx_component_set_bounciness(this._id, v);
  }
  get linearDamping() {
    return this.engine.wasm._wl_physx_component_get_linearDamping(this._id);
  }
  set linearDamping(v) {
    this.engine.wasm._wl_physx_component_set_linearDamping(this._id, v);
  }
  get angularDamping() {
    return this.engine.wasm._wl_physx_component_get_angularDamping(this._id);
  }
  set angularDamping(v) {
    this.engine.wasm._wl_physx_component_set_angularDamping(this._id, v);
  }
  set linearVelocity(v) {
    this.engine.wasm._wl_physx_component_set_linearVelocity(this._id, v[0], v[1], v[2]);
  }
  get linearVelocity() {
    let wasm = this.engine.wasm;
    return wasm._wl_physx_component_get_linearVelocity(this._id, wasm._tempMem), new Float32Array(wasm.HEAPF32.buffer, wasm._tempMem, 3);
  }
  set angularVelocity(v) {
    this.engine.wasm._wl_physx_component_set_angularVelocity(this._id, v[0], v[1], v[2]);
  }
  get angularVelocity() {
    let wasm = this.engine.wasm;
    return wasm._wl_physx_component_get_angularVelocity(this._id, wasm._tempMem), new Float32Array(wasm.HEAPF32.buffer, wasm._tempMem, 3);
  }
  set groupsMask(flags) {
    this.engine.wasm._wl_physx_component_set_groupsMask(this._id, flags);
  }
  get groupsMask() {
    return this.engine.wasm._wl_physx_component_get_groupsMask(this._id);
  }
  set blocksMask(flags) {
    this.engine.wasm._wl_physx_component_set_blocksMask(this._id, flags);
  }
  get blocksMask() {
    return this.engine.wasm._wl_physx_component_get_blocksMask(this._id);
  }
  set linearLockAxis(lock) {
    this.engine.wasm._wl_physx_component_set_linearLockAxis(this._id, lock);
  }
  get linearLockAxis() {
    return this.engine.wasm._wl_physx_component_get_linearLockAxis(this._id);
  }
  set angularLockAxis(lock) {
    this.engine.wasm._wl_physx_component_set_angularLockAxis(this._id, lock);
  }
  get angularLockAxis() {
    return this.engine.wasm._wl_physx_component_get_angularLockAxis(this._id);
  }
  set mass(m) {
    this.engine.wasm._wl_physx_component_set_mass(this._id, m);
  }
  get mass() {
    return this.engine.wasm._wl_physx_component_get_mass(this._id);
  }
  set massSpaceInteriaTensor(v) {
    this.engine.wasm._wl_physx_component_set_massSpaceInertiaTensor(this._id, v[0], v[1], v[2]);
  }
  set sleepOnActivate(flag) {
    this.engine.wasm._wl_physx_component_set_sleepOnActivate(this._id, flag);
  }
  get sleepOnActivate() {
    return !!this.engine.wasm._wl_physx_component_get_sleepOnActivate(this._id);
  }
  addForce(f, m = 0, localForce = false, p, local = false) {
    let wasm = this.engine.wasm;
    if (!p) {
      wasm._wl_physx_component_addForce(this._id, f[0], f[1], f[2], m, localForce);
      return;
    }
    wasm._wl_physx_component_addForceAt(this._id, f[0], f[1], f[2], m, localForce, p[0], p[1], p[2], local);
  }
  addTorque(f, m = 0) {
    this.engine.wasm._wl_physx_component_addTorque(this._id, f[0], f[1], f[2], m);
  }
  onCollision(callback) {
    return this.onCollisionWith(this, callback);
  }
  onCollisionWith(otherComp, callback) {
    let callbacks = this.scene._pxCallbacks;
    return callbacks.has(this._id) || callbacks.set(this._id, []), callbacks.get(this._id).push(callback), this.engine.wasm._wl_physx_component_addCallback(this._id, otherComp._id);
  }
  removeCollisionCallback(callbackId) {
    let r = this.engine.wasm._wl_physx_component_removeCallback(this._id, callbackId), callbacks = this.scene._pxCallbacks;
    r && callbacks.get(this._id).splice(-r);
  }
}, __publicField(_a10, "TypeName", "physx"), _a10);
__decorateClass([nativeProperty()], PhysXComponent.prototype, "static", 1), __decorateClass([nativeProperty()], PhysXComponent.prototype, "translationOffset", 1), __decorateClass([nativeProperty()], PhysXComponent.prototype, "rotationOffset", 1), __decorateClass([nativeProperty()], PhysXComponent.prototype, "kinematic", 1), __decorateClass([nativeProperty()], PhysXComponent.prototype, "gravity", 1), __decorateClass([nativeProperty()], PhysXComponent.prototype, "simulate", 1), __decorateClass([nativeProperty()], PhysXComponent.prototype, "allowSimulation", 1), __decorateClass([nativeProperty()], PhysXComponent.prototype, "allowQuery", 1), __decorateClass([nativeProperty()], PhysXComponent.prototype, "trigger", 1), __decorateClass([nativeProperty()], PhysXComponent.prototype, "shape", 1), __decorateClass([nativeProperty()], PhysXComponent.prototype, "shapeData", 1), __decorateClass([nativeProperty()], PhysXComponent.prototype, "extents", 1), __decorateClass([nativeProperty()], PhysXComponent.prototype, "staticFriction", 1), __decorateClass([nativeProperty()], PhysXComponent.prototype, "dynamicFriction", 1), __decorateClass([nativeProperty()], PhysXComponent.prototype, "bounciness", 1), __decorateClass([nativeProperty()], PhysXComponent.prototype, "linearDamping", 1), __decorateClass([nativeProperty()], PhysXComponent.prototype, "angularDamping", 1), __decorateClass([nativeProperty()], PhysXComponent.prototype, "linearVelocity", 1), __decorateClass([nativeProperty()], PhysXComponent.prototype, "angularVelocity", 1), __decorateClass([nativeProperty()], PhysXComponent.prototype, "groupsMask", 1), __decorateClass([nativeProperty()], PhysXComponent.prototype, "blocksMask", 1), __decorateClass([nativeProperty()], PhysXComponent.prototype, "linearLockAxis", 1), __decorateClass([nativeProperty()], PhysXComponent.prototype, "angularLockAxis", 1), __decorateClass([nativeProperty()], PhysXComponent.prototype, "mass", 1), __decorateClass([nativeProperty()], PhysXComponent.prototype, "sleepOnActivate", 1);
var Physics = class {
  _hit;
  _engine;
  _rayHit;
  constructor(engine2) {
    this._engine = engine2, this._rayHit = engine2.wasm._malloc(4 * (3 * 4 + 3 * 4 + 4 + 2) + 4), this._hit = new RayHit(engine2.scene, this._rayHit);
  }
  rayCast(o, d, groupMask, maxDistance = 100) {
    let scene = this._engine.scene._index;
    return this._engine.wasm._wl_physx_ray_cast(scene, o[0], o[1], o[2], d[0], d[1], d[2], groupMask, maxDistance, this._rayHit), this._hit;
  }
  get engine() {
    return this._engine;
  }
};
var MeshIndexType = ((MeshIndexType2) => (MeshIndexType2[MeshIndexType2.UnsignedByte = 1] = "UnsignedByte", MeshIndexType2[MeshIndexType2.UnsignedShort = 2] = "UnsignedShort", MeshIndexType2[MeshIndexType2.UnsignedInt = 4] = "UnsignedInt", MeshIndexType2))(MeshIndexType || {});
var MeshSkinningType = ((MeshSkinningType2) => (MeshSkinningType2[MeshSkinningType2.None = 0] = "None", MeshSkinningType2[MeshSkinningType2.FourJoints = 1] = "FourJoints", MeshSkinningType2[MeshSkinningType2.EightJoints = 2] = "EightJoints", MeshSkinningType2))(MeshSkinningType || {});
var Mesh = class extends Resource {
  constructor(engine2, params) {
    if (!isNumber(params)) {
      let mesh = engine2.meshes.create(params);
      return super(engine2, mesh._index), mesh;
    }
    super(engine2, params);
  }
  get vertexCount() {
    return this.engine.wasm._wl_mesh_get_vertexCount(this._id);
  }
  get indexData() {
    let wasm = this.engine.wasm, tempMem = wasm._tempMem, ptr = wasm._wl_mesh_get_indexData(this._id, tempMem, tempMem + 4);
    if (ptr === null)
      return null;
    let indexCount = wasm.HEAPU32[tempMem / 4];
    switch (wasm.HEAPU32[tempMem / 4 + 1]) {
      case 1:
        return new Uint8Array(wasm.HEAPU8.buffer, ptr, indexCount);
      case 2:
        return new Uint16Array(wasm.HEAPU16.buffer, ptr, indexCount);
      case 4:
        return new Uint32Array(wasm.HEAPU32.buffer, ptr, indexCount);
    }
    return null;
  }
  update() {
    this.engine.wasm._wl_mesh_update(this._id);
  }
  getBoundingSphere(out = new Float32Array(4)) {
    let wasm = this.engine.wasm;
    return this.engine.wasm._wl_mesh_get_boundingSphere(this._id, wasm._tempMem), out[0] = wasm._tempMemFloat[0], out[1] = wasm._tempMemFloat[1], out[2] = wasm._tempMemFloat[2], out[3] = wasm._tempMemFloat[3], out;
  }
  attribute(attr) {
    if (typeof attr != "number")
      throw new TypeError("Expected number, but got " + typeof attr);
    let wasm = this.engine.wasm, tempMemUint32 = wasm._tempMemUint32;
    if (wasm._wl_mesh_get_attribute(this._id, attr, wasm._tempMem), tempMemUint32[0] == 255)
      return null;
    let arraySize = tempMemUint32[5];
    return new MeshAttributeAccessor(this.engine, { attribute: tempMemUint32[0], offset: tempMemUint32[1], stride: tempMemUint32[2], formatSize: tempMemUint32[3], componentCount: tempMemUint32[4], arraySize: arraySize || 1, length: this.vertexCount, bufferType: attr !== 5 ? Float32Array : Uint16Array });
  }
  destroy() {
    this.engine.wasm._wl_mesh_destroy(this._id), this.engine.meshes._destroy(this);
  }
  toString() {
    return this.isDestroyed ? "Mesh(destroyed)" : `Mesh(${this._index})`;
  }
};
var MeshAttributeAccessor = class {
  length = 0;
  _engine;
  _attribute = -1;
  _offset = 0;
  _stride = 0;
  _formatSize = 0;
  _componentCount = 0;
  _arraySize = 1;
  _bufferType;
  _tempBufferGetter;
  constructor(engine2, options) {
    this._engine = engine2;
    let wasm = this._engine.wasm;
    this._attribute = options.attribute, this._offset = options.offset, this._stride = options.stride, this._formatSize = options.formatSize, this._componentCount = options.componentCount, this._arraySize = options.arraySize, this._bufferType = options.bufferType, this.length = options.length, this._tempBufferGetter = this._bufferType === Float32Array ? wasm.getTempBufferF32.bind(wasm) : wasm.getTempBufferU16.bind(wasm);
  }
  createArray(count = 1) {
    return count = count > this.length ? this.length : count, new this._bufferType(count * this._componentCount * this._arraySize);
  }
  get(index, out = this.createArray()) {
    if (out.length % this._componentCount !== 0)
      throw new Error(`out.length, ${out.length} is not a multiple of the attribute vector components, ${this._componentCount}`);
    let dest = this._tempBufferGetter(out.length), elementSize = this._bufferType.BYTES_PER_ELEMENT, destSize = elementSize * out.length, srcFormatSize = this._formatSize * this._arraySize, destFormatSize = this._componentCount * elementSize * this._arraySize;
    this._engine.wasm._wl_mesh_get_attribute_values(this._attribute, srcFormatSize, this._offset + index * this._stride, this._stride, destFormatSize, dest.byteOffset, destSize);
    for (let i = 0; i < out.length; ++i)
      out[i] = dest[i];
    return out;
  }
  set(i, v) {
    if (v.length % this._componentCount !== 0)
      throw new Error(`out.length, ${v.length} is not a multiple of the attribute vector components, ${this._componentCount}`);
    let elementSize = this._bufferType.BYTES_PER_ELEMENT, srcSize = elementSize * v.length, srcFormatSize = this._componentCount * elementSize * this._arraySize, destFormatSize = this._formatSize * this._arraySize, wasm = this._engine.wasm;
    if (v.buffer != wasm.HEAPU8.buffer) {
      let dest = this._tempBufferGetter(v.length);
      dest.set(v), v = dest;
    }
    return wasm._wl_mesh_set_attribute_values(this._attribute, srcFormatSize, v.byteOffset, srcSize, destFormatSize, this._offset + i * this._stride, this._stride), this;
  }
  get engine() {
    return this._engine;
  }
};
var Font = class extends Resource {
  get emHeight() {
    return this.engine.wasm._wl_font_get_emHeight(this._id);
  }
  get capHeight() {
    return this.engine.wasm._wl_font_get_capHeight(this._id);
  }
  get xHeight() {
    return this.engine.wasm._wl_font_get_xHeight(this._id);
  }
  get outlineSize() {
    return this.engine.wasm._wl_font_get_outlineSize(this._id);
  }
};
var temp2d = null;
var Texture = class extends Resource {
  constructor(engine2, param) {
    if (isImageLike(param)) {
      let texture = engine2.textures.create(param);
      return super(engine2, texture._index), texture;
    }
    super(engine2, param);
  }
  get valid() {
    return !this.isDestroyed;
  }
  get id() {
    return this.index;
  }
  update() {
    let image = this._imageIndex;
    !this.valid || !image || this.engine.wasm._wl_renderer_updateImage(image);
  }
  get width() {
    let element = this.htmlElement;
    if (element)
      return element.width;
    let wasm = this.engine.wasm;
    return wasm._wl_image_size(this._imageIndex, wasm._tempMem), wasm._tempMemUint32[0];
  }
  get height() {
    let element = this.htmlElement;
    if (element)
      return element.height;
    let wasm = this.engine.wasm;
    return wasm._wl_image_size(this._imageIndex, wasm._tempMem), wasm._tempMemUint32[1];
  }
  get htmlElement() {
    let image = this._imageIndex;
    if (!image)
      return null;
    let wasm = this.engine.wasm, jsImageIndex = wasm._wl_image_get_jsImage_index(image);
    return wasm._images[jsImageIndex];
  }
  updateSubImage(x, y, w, h) {
    if (this.isDestroyed)
      return;
    let image = this._imageIndex;
    if (!image)
      return;
    let wasm = this.engine.wasm, jsImageIndex = wasm._wl_image_get_jsImage_index(image);
    if (!temp2d) {
      let canvas = document.createElement("canvas"), ctx = canvas.getContext("2d");
      if (!ctx)
        throw new Error("Texture.updateSubImage(): Failed to obtain CanvasRenderingContext2D.");
      temp2d = { canvas, ctx };
    }
    let img = wasm._images[jsImageIndex];
    if (!img)
      return;
    temp2d.canvas.width = w, temp2d.canvas.height = h, temp2d.ctx.drawImage(img, x, y, w, h, 0, 0, w, h);
    let yOffset = (img.videoHeight ?? img.height) - y - h;
    wasm._images[jsImageIndex] = temp2d.canvas, wasm._wl_renderer_updateImage(image, x, yOffset), wasm._images[jsImageIndex] = img;
  }
  destroy() {
    this.engine.wasm._wl_texture_destroy(this._id), this.engine.textures._destroy(this);
  }
  toString() {
    return this.isDestroyed ? "Texture(destroyed)" : `Texture(${this._index})`;
  }
  get _imageIndex() {
    return this.engine.wasm._wl_texture_get_image_index(this._id);
  }
};
var Animation = class extends SceneResource {
  constructor(host = WL, index) {
    let scene = host instanceof Prefab ? host : host.scene;
    super(scene, index);
  }
  get duration() {
    return this.engine.wasm._wl_animation_get_duration(this._id);
  }
  get trackCount() {
    return this.engine.wasm._wl_animation_get_trackCount(this._id);
  }
  retarget(newTargets) {
    let wasm = this.engine.wasm;
    if (newTargets instanceof Skin) {
      let index2 = wasm._wl_animation_retargetToSkin(this._id, newTargets._id);
      return this._scene.animations.wrap(index2);
    }
    if (newTargets.length != this.trackCount)
      throw Error("Expected " + this.trackCount.toString() + " targets, but got " + newTargets.length.toString());
    let ptr = wasm._malloc(2 * newTargets.length);
    for (let i = 0; i < newTargets.length; ++i) {
      let object3d = newTargets[i];
      this.scene.assertOrigin(object3d), wasm.HEAPU16[(ptr >>> 1) + i] = newTargets[i].objectId;
    }
    let index = wasm._wl_animation_retarget(this._id, ptr);
    return wasm._free(ptr), this._scene.animations.wrap(index);
  }
  toString() {
    return this.isDestroyed ? "Animation(destroyed)" : `Animation(${this._index})`;
  }
};
var Object3D = class {
  _id = -1;
  _localId = -1;
  _scene;
  _engine;
  constructor(scene, id) {
    scene = scene instanceof Prefab ? scene : scene.scene, this._localId = id, this._id = scene._index << 22 | id, this._scene = scene, this._engine = scene.engine;
  }
  get name() {
    let wasm = this._engine.wasm;
    return wasm.UTF8ToString(wasm._wl_object_name(this._id));
  }
  set name(newName) {
    let wasm = this._engine.wasm;
    wasm._wl_object_set_name(this._id, wasm.tempUTF8(newName));
  }
  get parent() {
    let p = this._engine.wasm._wl_object_parent(this._id);
    return p === 0 ? null : this._scene.wrap(p);
  }
  get children() {
    return this.getChildren();
  }
  get childrenCount() {
    return this._engine.wasm._wl_object_get_children_count(this._id);
  }
  set parent(newParent) {
    if (this.markedDestroyed) {
      let strThis = this.toString(), strParent = newParent || "root";
      throw new Error(`Failed to attach ${strThis} to ${strParent}. ${strThis} is marked as destroyed.`);
    } else if (newParent?.markedDestroyed) {
      let strParent = newParent.toString();
      throw new Error(`Failed to attach ${this} to ${strParent}. ${strParent} is marked as destroyed.`);
    }
    this.scene.assertOrigin(newParent), this._engine.wasm._wl_object_set_parent(this._id, newParent == null ? 0 : newParent._id);
  }
  get objectId() {
    return this._localId;
  }
  get scene() {
    return this._scene;
  }
  get engine() {
    return this._engine;
  }
  addChild() {
    let objectId = this.engine.wasm._wl_scene_add_object(this.scene._index, this._id);
    return this.scene.wrap(objectId);
  }
  clone(parent = null) {
    this.scene.assertOrigin(parent);
    let id = this._engine.wasm._wl_object_clone(this._id, parent ? parent._id : 0);
    return this._scene.wrap(id);
  }
  getChildren(out = new Array(this.childrenCount)) {
    let childrenCount = this.childrenCount;
    if (childrenCount === 0)
      return out;
    let wasm = this._engine.wasm;
    wasm.requireTempMem(childrenCount * 2), this._engine.wasm._wl_object_get_children(this._id, wasm._tempMem, wasm._tempMemSize >> 1);
    for (let i = 0; i < childrenCount; ++i)
      out[i] = this._scene.wrap(wasm._tempMemUint16[i]);
    return out;
  }
  resetTransform() {
    return this._engine.wasm._wl_object_reset_translation_rotation(this._id), this._engine.wasm._wl_object_reset_scaling(this._id), this;
  }
  resetPositionRotation() {
    return this._engine.wasm._wl_object_reset_translation_rotation(this._id), this;
  }
  resetTranslationRotation() {
    return this.resetPositionRotation();
  }
  resetRotation() {
    return this._engine.wasm._wl_object_reset_rotation(this._id), this;
  }
  resetPosition() {
    return this._engine.wasm._wl_object_reset_translation(this._id), this;
  }
  resetTranslation() {
    return this.resetPosition();
  }
  resetScaling() {
    return this._engine.wasm._wl_object_reset_scaling(this._id), this;
  }
  translate(v) {
    return this.translateLocal(v);
  }
  translateLocal(v) {
    return this._engine.wasm._wl_object_translate(this._id, v[0], v[1], v[2]), this;
  }
  translateObject(v) {
    return this._engine.wasm._wl_object_translate_obj(this._id, v[0], v[1], v[2]), this;
  }
  translateWorld(v) {
    return this._engine.wasm._wl_object_translate_world(this._id, v[0], v[1], v[2]), this;
  }
  rotateAxisAngleDeg(a, d) {
    return this.rotateAxisAngleDegLocal(a, d), this;
  }
  rotateAxisAngleDegLocal(a, d) {
    return this._engine.wasm._wl_object_rotate_axis_angle(this._id, a[0], a[1], a[2], d), this;
  }
  rotateAxisAngleRad(a, d) {
    return this.rotateAxisAngleRadLocal(a, d);
  }
  rotateAxisAngleRadLocal(a, d) {
    return this._engine.wasm._wl_object_rotate_axis_angle_rad(this._id, a[0], a[1], a[2], d), this;
  }
  rotateAxisAngleDegObject(a, d) {
    return this._engine.wasm._wl_object_rotate_axis_angle_obj(this._id, a[0], a[1], a[2], d), this;
  }
  rotateAxisAngleRadObject(a, d) {
    return this._engine.wasm._wl_object_rotate_axis_angle_rad_obj(this._id, a[0], a[1], a[2], d), this;
  }
  rotate(q) {
    return this.rotateLocal(q), this;
  }
  rotateLocal(q) {
    return this._engine.wasm._wl_object_rotate_quat(this._id, q[0], q[1], q[2], q[3]), this;
  }
  rotateObject(q) {
    return this._engine.wasm._wl_object_rotate_quat_obj(this._id, q[0], q[1], q[2], q[3]), this;
  }
  scale(v) {
    return this.scaleLocal(v), this;
  }
  scaleLocal(v) {
    return this._engine.wasm._wl_object_scale(this._id, v[0], v[1], v[2]), this;
  }
  getPositionLocal(out = new Float32Array(3)) {
    let wasm = this._engine.wasm;
    return wasm._wl_object_get_translation_local(this._id, wasm._tempMem), out[0] = wasm._tempMemFloat[0], out[1] = wasm._tempMemFloat[1], out[2] = wasm._tempMemFloat[2], out;
  }
  getTranslationLocal(out = new Float32Array(3)) {
    return this.getPositionLocal(out);
  }
  getPositionWorld(out = new Float32Array(3)) {
    let wasm = this._engine.wasm;
    return wasm._wl_object_get_translation_world(this._id, wasm._tempMem), out[0] = wasm._tempMemFloat[0], out[1] = wasm._tempMemFloat[1], out[2] = wasm._tempMemFloat[2], out;
  }
  getTranslationWorld(out = new Float32Array(3)) {
    return this.getPositionWorld(out);
  }
  setPositionLocal(v) {
    return this._engine.wasm._wl_object_set_translation_local(this._id, v[0], v[1], v[2]), this;
  }
  setTranslationLocal(v) {
    return this.setPositionLocal(v);
  }
  setPositionWorld(v) {
    return this._engine.wasm._wl_object_set_translation_world(this._id, v[0], v[1], v[2]), this;
  }
  setTranslationWorld(v) {
    return this.setPositionWorld(v);
  }
  getScalingLocal(out = new Float32Array(3)) {
    let wasm = this._engine.wasm, ptr = wasm._wl_object_scaling_local(this._id) / 4;
    return out[0] = wasm.HEAPF32[ptr], out[1] = wasm.HEAPF32[ptr + 1], out[2] = wasm.HEAPF32[ptr + 2], out;
  }
  setScalingLocal(v) {
    return this._engine.wasm._wl_object_set_scaling_local(this._id, v[0], v[1], v[2]), this;
  }
  getScalingWorld(out = new Float32Array(3)) {
    let wasm = this._engine.wasm, ptr = wasm._wl_object_scaling_world(this._id) / 4;
    return out[0] = wasm.HEAPF32[ptr], out[1] = wasm.HEAPF32[ptr + 1], out[2] = wasm.HEAPF32[ptr + 2], out;
  }
  setScalingWorld(v) {
    return this._engine.wasm._wl_object_set_scaling_world(this._id, v[0], v[1], v[2]), this;
  }
  getRotationLocal(out = new Float32Array(4)) {
    let wasm = this._engine.wasm, ptr = wasm._wl_object_trans_local(this._id) / 4;
    return out[0] = wasm.HEAPF32[ptr], out[1] = wasm.HEAPF32[ptr + 1], out[2] = wasm.HEAPF32[ptr + 2], out[3] = wasm.HEAPF32[ptr + 3], out;
  }
  setRotationLocal(v) {
    return this._engine.wasm._wl_object_set_rotation_local(this._id, v[0], v[1], v[2], v[3]), this;
  }
  getRotationWorld(out = new Float32Array(4)) {
    let wasm = this._engine.wasm, ptr = wasm._wl_object_trans_world(this._id) / 4;
    return out[0] = wasm.HEAPF32[ptr], out[1] = wasm.HEAPF32[ptr + 1], out[2] = wasm.HEAPF32[ptr + 2], out[3] = wasm.HEAPF32[ptr + 3], out;
  }
  setRotationWorld(v) {
    return this._engine.wasm._wl_object_set_rotation_world(this._id, v[0], v[1], v[2], v[3]), this;
  }
  getTransformLocal(out = new Float32Array(8)) {
    let wasm = this._engine.wasm, ptr = wasm._wl_object_trans_local(this._id) / 4;
    return out[0] = wasm.HEAPF32[ptr], out[1] = wasm.HEAPF32[ptr + 1], out[2] = wasm.HEAPF32[ptr + 2], out[3] = wasm.HEAPF32[ptr + 3], out[4] = wasm.HEAPF32[ptr + 4], out[5] = wasm.HEAPF32[ptr + 5], out[6] = wasm.HEAPF32[ptr + 6], out[7] = wasm.HEAPF32[ptr + 7], out;
  }
  setTransformLocal(v) {
    let wasm = this._engine.wasm, ptr = wasm._wl_object_trans_local(this._id) / 4;
    return wasm.HEAPF32[ptr] = v[0], wasm.HEAPF32[ptr + 1] = v[1], wasm.HEAPF32[ptr + 2] = v[2], wasm.HEAPF32[ptr + 3] = v[3], wasm.HEAPF32[ptr + 4] = v[4], wasm.HEAPF32[ptr + 5] = v[5], wasm.HEAPF32[ptr + 6] = v[6], wasm.HEAPF32[ptr + 7] = v[7], this.setDirty(), this;
  }
  getTransformWorld(out = new Float32Array(8)) {
    let wasm = this._engine.wasm, ptr = wasm._wl_object_trans_world(this._id) / 4;
    return out[0] = wasm.HEAPF32[ptr], out[1] = wasm.HEAPF32[ptr + 1], out[2] = wasm.HEAPF32[ptr + 2], out[3] = wasm.HEAPF32[ptr + 3], out[4] = wasm.HEAPF32[ptr + 4], out[5] = wasm.HEAPF32[ptr + 5], out[6] = wasm.HEAPF32[ptr + 6], out[7] = wasm.HEAPF32[ptr + 7], out;
  }
  setTransformWorld(v) {
    let wasm = this._engine.wasm, ptr = wasm._wl_object_trans_world(this._id) / 4;
    return wasm.HEAPF32[ptr] = v[0], wasm.HEAPF32[ptr + 1] = v[1], wasm.HEAPF32[ptr + 2] = v[2], wasm.HEAPF32[ptr + 3] = v[3], wasm.HEAPF32[ptr + 4] = v[4], wasm.HEAPF32[ptr + 5] = v[5], wasm.HEAPF32[ptr + 6] = v[6], wasm.HEAPF32[ptr + 7] = v[7], this._engine.wasm._wl_object_trans_world_to_local(this._id), this;
  }
  get transformLocal() {
    let wasm = this._engine.wasm;
    return new Float32Array(wasm.HEAPF32.buffer, wasm._wl_object_trans_local(this._id), 8);
  }
  set transformLocal(t) {
    this.transformLocal.set(t), this.setDirty();
  }
  get transformWorld() {
    let wasm = this._engine.wasm;
    return new Float32Array(wasm.HEAPF32.buffer, wasm._wl_object_trans_world(this._id), 8);
  }
  set transformWorld(t) {
    this.transformWorld.set(t), this._engine.wasm._wl_object_trans_world_to_local(this._id);
  }
  get scalingLocal() {
    let wasm = this._engine.wasm;
    return new Float32Array(wasm.HEAPF32.buffer, wasm._wl_object_scaling_local(this._id), 3);
  }
  set scalingLocal(s) {
    this.scalingLocal.set(s), this.setDirty();
  }
  get scalingWorld() {
    let wasm = this._engine.wasm;
    return new Float32Array(wasm.HEAPF32.buffer, wasm._wl_object_scaling_world(this._id), 3);
  }
  set scalingWorld(s) {
    this.scalingWorld.set(s), this._engine.wasm._wl_object_scaling_world_to_local(this._id);
  }
  get rotationLocal() {
    return this.transformLocal.subarray(0, 4);
  }
  get rotationWorld() {
    return this.transformWorld.subarray(0, 4);
  }
  set rotationLocal(r) {
    this._engine.wasm._wl_object_set_rotation_local(this._id, r[0], r[1], r[2], r[3]);
  }
  set rotationWorld(r) {
    this._engine.wasm._wl_object_set_rotation_world(this._id, r[0], r[1], r[2], r[3]);
  }
  getForward(out) {
    return this.getForwardWorld(out);
  }
  getForwardWorld(out) {
    return out[0] = 0, out[1] = 0, out[2] = -1, this.transformVectorWorld(out), out;
  }
  getUp(out) {
    return this.getUpWorld(out);
  }
  getUpWorld(out) {
    return out[0] = 0, out[1] = 1, out[2] = 0, this.transformVectorWorld(out), out;
  }
  getRight(out) {
    return this.getRightWorld(out);
  }
  getRightWorld(out) {
    return out[0] = 1, out[1] = 0, out[2] = 0, this.transformVectorWorld(out), out;
  }
  transformVectorWorld(out, v = out) {
    let wasm = this._engine.wasm;
    return wasm._tempMemFloat[0] = v[0], wasm._tempMemFloat[1] = v[1], wasm._tempMemFloat[2] = v[2], wasm._wl_object_transformVectorWorld(this._id, wasm._tempMem), out[0] = wasm._tempMemFloat[0], out[1] = wasm._tempMemFloat[1], out[2] = wasm._tempMemFloat[2], out;
  }
  transformVectorLocal(out, v = out) {
    let wasm = this._engine.wasm;
    return wasm._tempMemFloat[0] = v[0], wasm._tempMemFloat[1] = v[1], wasm._tempMemFloat[2] = v[2], wasm._wl_object_transformVectorLocal(this._id, wasm._tempMem), out[0] = wasm._tempMemFloat[0], out[1] = wasm._tempMemFloat[1], out[2] = wasm._tempMemFloat[2], out;
  }
  transformPointWorld(out, p = out) {
    let wasm = this._engine.wasm;
    return wasm._tempMemFloat[0] = p[0], wasm._tempMemFloat[1] = p[1], wasm._tempMemFloat[2] = p[2], wasm._wl_object_transformPointWorld(this._id, wasm._tempMem), out[0] = wasm._tempMemFloat[0], out[1] = wasm._tempMemFloat[1], out[2] = wasm._tempMemFloat[2], out;
  }
  transformPointLocal(out, p = out) {
    let wasm = this._engine.wasm;
    return wasm._tempMemFloat[0] = p[0], wasm._tempMemFloat[1] = p[1], wasm._tempMemFloat[2] = p[2], wasm._wl_object_transformPointLocal(this._id, wasm._tempMem), out[0] = wasm._tempMemFloat[0], out[1] = wasm._tempMemFloat[1], out[2] = wasm._tempMemFloat[2], out;
  }
  transformVectorInverseWorld(out, v = out) {
    let wasm = this._engine.wasm;
    return wasm._tempMemFloat[0] = v[0], wasm._tempMemFloat[1] = v[1], wasm._tempMemFloat[2] = v[2], wasm._wl_object_transformVectorInverseWorld(this._id, wasm._tempMem), out[0] = wasm._tempMemFloat[0], out[1] = wasm._tempMemFloat[1], out[2] = wasm._tempMemFloat[2], out;
  }
  transformVectorInverseLocal(out, v = out) {
    let wasm = this._engine.wasm;
    return wasm._tempMemFloat[0] = v[0], wasm._tempMemFloat[1] = v[1], wasm._tempMemFloat[2] = v[2], wasm._wl_object_transformVectorInverseLocal(this._id, wasm._tempMem), out[0] = wasm._tempMemFloat[0], out[1] = wasm._tempMemFloat[1], out[2] = wasm._tempMemFloat[2], out;
  }
  transformPointInverseWorld(out, p = out) {
    let wasm = this._engine.wasm;
    return wasm._tempMemFloat[0] = p[0], wasm._tempMemFloat[1] = p[1], wasm._tempMemFloat[2] = p[2], wasm._wl_object_transformPointInverseWorld(this._id, wasm._tempMem), out[0] = wasm._tempMemFloat[0], out[1] = wasm._tempMemFloat[1], out[2] = wasm._tempMemFloat[2], out;
  }
  transformPointInverseLocal(out, p = out) {
    let wasm = this._engine.wasm;
    return wasm._tempMemFloat.set(p), wasm._wl_object_transformPointInverseLocal(this._id, wasm._tempMem), out[0] = wasm._tempMemFloat[0], out[1] = wasm._tempMemFloat[1], out[2] = wasm._tempMemFloat[2], out;
  }
  toWorldSpaceTransform(out, q = out) {
    let wasm = this._engine.wasm;
    return wasm._tempMemFloat.set(q), wasm._wl_object_toWorldSpaceTransform(this._id, wasm._tempMem), out[0] = wasm._tempMemFloat[0], out[1] = wasm._tempMemFloat[1], out[2] = wasm._tempMemFloat[2], out[3] = wasm._tempMemFloat[3], out[4] = wasm._tempMemFloat[4], out[5] = wasm._tempMemFloat[5], out[6] = wasm._tempMemFloat[6], out[7] = wasm._tempMemFloat[7], out;
  }
  toLocalSpaceTransform(out, q = out) {
    let p = this.parent;
    return p ? (p.toObjectSpaceTransform(out, q), out) : (out !== q && (out[0] = q[0], out[1] = q[1], out[2] = q[2], out[3] = q[3], out[4] = q[4], out[5] = q[5], out[6] = q[6], out[7] = q[7]), out);
  }
  toObjectSpaceTransform(out, q = out) {
    let wasm = this._engine.wasm;
    return wasm._tempMemFloat.set(q), wasm._wl_object_toObjectSpaceTransform(this._id, wasm._tempMem), out[0] = wasm._tempMemFloat[0], out[1] = wasm._tempMemFloat[1], out[2] = wasm._tempMemFloat[2], out[3] = wasm._tempMemFloat[3], out[4] = wasm._tempMemFloat[4], out[5] = wasm._tempMemFloat[5], out[6] = wasm._tempMemFloat[6], out[7] = wasm._tempMemFloat[7], out;
  }
  lookAt(p, up = UP_VECTOR) {
    return this._engine.wasm._wl_object_lookAt(this._id, p[0], p[1], p[2], up[0], up[1], up[2]), this;
  }
  destroy() {
    this._id < 0 || this.engine.wasm._wl_object_remove(this._id);
  }
  setDirty() {
    this._engine.wasm._wl_object_set_dirty(this._id);
  }
  set active(b) {
    let comps = this.getComponents();
    for (let c of comps)
      c.active = b;
  }
  getComponent(typeOrClass, index = 0) {
    let wasm = this._engine.wasm, type = isString(typeOrClass) ? typeOrClass : typeOrClass.TypeName, scene = this._scene, componentType = wasm._wl_scene_get_component_manager_index(scene._index, wasm.tempUTF8(type));
    if (componentType < 0) {
      let typeIndex = wasm._componentTypeIndices[type];
      if (typeIndex === void 0)
        return null;
      let jsIndex = wasm._wl_get_js_component_index(this._id, typeIndex, index);
      if (jsIndex < 0)
        return null;
      let component = this._scene._jsComponents[jsIndex];
      return component.constructor !== BrokenComponent ? component : null;
    }
    let componentId = wasm._wl_get_component_id(this._id, componentType, index);
    return scene._components.wrapNative(componentType, componentId);
  }
  getComponents(typeOrClass) {
    let wasm = this._engine.wasm, scene = this._scene, manager = null, type = null;
    if (typeOrClass) {
      type = isString(typeOrClass) ? typeOrClass : typeOrClass.TypeName;
      let nativeManager = scene._components.getNativeManager(type);
      manager = nativeManager !== null ? nativeManager : scene._components.js;
    }
    let components = [], maxComps = Math.floor(wasm._tempMemSize / 3 * 2), componentsCount = wasm._wl_object_get_components(this._id, wasm._tempMem, maxComps), offset = 2 * componentsCount;
    wasm._wl_object_get_component_types(this._id, wasm._tempMem + offset, maxComps);
    for (let i = 0; i < componentsCount; ++i) {
      let t = wasm._tempMemUint8[i + offset], componentId = wasm._tempMemUint16[i];
      if (manager !== null && t !== manager)
        continue;
      let comp = this._scene._components.wrapAny(t, componentId);
      comp && (type && type !== comp.constructor.TypeName || components.push(comp));
    }
    return components;
  }
  addComponent(typeOrClass, params) {
    if (this.markedDestroyed)
      throw new Error(`Failed to add component. ${this} is marked as destroyed.`);
    let wasm = this._engine.wasm, type = isString(typeOrClass) ? typeOrClass : typeOrClass.TypeName, nativeManager = this._scene._components.getNativeManager(type), isNative = nativeManager !== null, manager = isNative ? nativeManager : this._scene._components.js, componentId = -1;
    if (isNative)
      componentId = wasm._wl_object_add_component(this._id, manager);
    else {
      if (!(type in wasm._componentTypeIndices))
        throw new TypeError("Unknown component type '" + type + "'");
      componentId = wasm._wl_object_add_js_component(this._id, wasm._componentTypeIndices[type]);
    }
    let component = this._scene._components.wrapAny(manager, componentId);
    return params !== void 0 && component.copy(params), isNative || component._triggerInit(), (!params || !("active" in params && !params.active)) && (component.active = true), component;
  }
  findByName(name, recursive = false) {
    return recursive ? this.findByNameRecursive(name) : this.findByNameDirect(name);
  }
  findByNameDirect(name) {
    let wasm = this._engine.wasm, id = this._id, maxCount = (wasm._tempMemSize >> 2) - 2, buffer = wasm._tempMemUint16;
    buffer[maxCount] = 0, buffer[maxCount + 1] = 0;
    let bufferPtr = wasm._tempMem, indexPtr = bufferPtr + maxCount * 2, childCountPtr = bufferPtr + maxCount * 2 + 2, namePtr = wasm.tempUTF8(name, (maxCount + 2) * 2), result = [], read = 0;
    for (; read = wasm._wl_object_findByName(id, namePtr, indexPtr, childCountPtr, bufferPtr, maxCount); )
      for (let i = 0; i < read; ++i)
        result.push(this._scene.wrap(buffer[i]));
    return result;
  }
  findByNameRecursive(name) {
    let wasm = this._engine.wasm, id = this._id, maxCount = (wasm._tempMemSize >> 2) - 1, buffer = wasm._tempMemUint16;
    buffer[maxCount] = 0;
    let bufferPtr = wasm._tempMem, indexPtr = bufferPtr + maxCount * 2, namePtr = wasm.tempUTF8(name, (maxCount + 1) * 2), read = 0, result = [];
    for (; read = wasm._wl_object_findByNameRecursive(id, namePtr, indexPtr, bufferPtr, maxCount); )
      for (let i = 0; i < read; ++i)
        result.push(this._scene.wrap(buffer[i]));
    return result;
  }
  get changed() {
    return !!this._engine.wasm._wl_object_is_changed(this._id);
  }
  get isDestroyed() {
    return this._id < 0;
  }
  get markedDestroyed() {
    let wasm = this.engine.wasm;
    return wasm._wl_object_markedDestroyed ? !!wasm._wl_object_markedDestroyed(this._id) : false;
  }
  equals(otherObject) {
    return otherObject ? this._id == otherObject._id : false;
  }
  toString() {
    return this.isDestroyed ? "Object3D(destroyed)" : `Object3D('${this.name}', ${this._localId})`;
  }
};
var Skin = class extends SceneResource {
  get jointCount() {
    return this.engine.wasm._wl_skin_get_joint_count(this._id);
  }
  get jointIds() {
    let wasm = this.engine.wasm;
    return new Uint16Array(wasm.HEAPU16.buffer, wasm._wl_skin_joint_ids(this._id), this.jointCount);
  }
  get inverseBindTransforms() {
    let wasm = this.engine.wasm;
    return new Float32Array(wasm.HEAPF32.buffer, wasm._wl_skin_inverse_bind_transforms(this._id), 8 * this.jointCount);
  }
  get inverseBindScalings() {
    let wasm = this.engine.wasm;
    return new Float32Array(wasm.HEAPF32.buffer, wasm._wl_skin_inverse_bind_scalings(this._id), 3 * this.jointCount);
  }
};
var MorphTargets = class extends Resource {
  get count() {
    return this.engine.wasm._wl_morph_targets_get_target_count(this._id);
  }
  getTargetName(target) {
    if (target >= this.count)
      throw new Error(`Index ${target} is out of bounds for ${this.count} targets`);
    let wasm = this.engine.wasm;
    return wasm.UTF8ToString(wasm._wl_morph_targets_get_target_name(this._id, target));
  }
  getTargetIndex(name) {
    let wasm = this.engine.wasm, index = wasm._wl_morph_targets_get_target_index(this._id, wasm.tempUTF8(name));
    if (index === -1)
      throw Error(`Missing target '${name}'`);
    return index;
  }
};
var RayHit = class {
  _scene;
  _ptr;
  constructor(scene, ptr) {
    if (ptr & 3)
      throw new Error("Misaligned pointer: please report a bug");
    this._scene = scene, this._ptr = ptr;
  }
  getLocations(out) {
    out = out ?? Array.from({ length: this.hitCount }, () => new Float32Array(3));
    let wasm = this.engine.wasm, alignedPtr = this._ptr / 4;
    for (let i = 0; i < this.hitCount; ++i) {
      let locationPtr = alignedPtr + 3 * i;
      out[i][0] = wasm.HEAPF32[locationPtr], out[i][1] = wasm.HEAPF32[locationPtr + 1], out[i][2] = wasm.HEAPF32[locationPtr + 2];
    }
    return out;
  }
  getNormals(out) {
    out = out ?? Array.from({ length: this.hitCount }, () => new Float32Array(3));
    let wasm = this.engine.wasm, alignedPtr = (this._ptr + 48) / 4;
    for (let i = 0; i < this.hitCount; ++i) {
      let normalPtr = alignedPtr + 3 * i;
      out[i][0] = wasm.HEAPF32[normalPtr], out[i][1] = wasm.HEAPF32[normalPtr + 1], out[i][2] = wasm.HEAPF32[normalPtr + 2];
    }
    return out;
  }
  getDistances(out = new Float32Array(this.hitCount)) {
    let wasm = this.engine.wasm, alignedPtr = (this._ptr + 48 * 2) / 4;
    for (let i = 0; i < this.hitCount; ++i) {
      let distancePtr = alignedPtr + i;
      out[i] = wasm.HEAPF32[distancePtr];
    }
    return out;
  }
  getObjects(out = new Array(this.hitCount)) {
    let HEAPU16 = this.engine.wasm.HEAPU16, alignedPtr = this._ptr + (48 * 2 + 16) >> 1;
    for (let i = 0; i < this.hitCount; ++i)
      out[i] = this._scene.wrap(HEAPU16[alignedPtr + i]);
    return out;
  }
  get engine() {
    return this._scene.engine;
  }
  get locations() {
    return this.getLocations();
  }
  get normals() {
    return this.getNormals();
  }
  get distances() {
    return this.getDistances();
  }
  get objects() {
    let objects = [null, null, null, null];
    return this.getObjects(objects);
  }
  get hitCount() {
    return Math.min(this.engine.wasm.HEAPU32[this._ptr / 4 + 30], 4);
  }
};
var I18N = class {
  onLanguageChanged = new Emitter();
  _engine;
  _prevLanguageIndex = -1;
  constructor(engine2) {
    this._engine = engine2;
  }
  set language(code) {
    this.setLanguage(code);
  }
  get language() {
    let wasm = this._engine.wasm, code = wasm._wl_i18n_currentLanguage();
    return code === 0 ? null : wasm.UTF8ToString(code);
  }
  get currentIndex() {
    return this._engine.wasm._wl_i18n_currentLanguageIndex();
  }
  get previousIndex() {
    return this._prevLanguageIndex;
  }
  async setLanguage(code) {
    if (code == null)
      return Promise.resolve(this.currentIndex);
    let wasm = this._engine.wasm;
    this._prevLanguageIndex = this.currentIndex, wasm._wl_i18n_setLanguage(wasm.tempUTF8(code));
    let scene = this.engine.scene, filename = wasm.UTF8ToString(wasm._wl_i18n_languageFile(this.currentIndex)), url = `${scene.baseURL}/locale/${filename}`;
    return await scene._downloadDependency(url), this.onLanguageChanged.notify(this._prevLanguageIndex, this.currentIndex), this.currentIndex;
  }
  translate(term) {
    let wasm = this._engine.wasm, translation = wasm._wl_i18n_translate(wasm.tempUTF8(term));
    return translation === 0 ? null : wasm.UTF8ToString(translation);
  }
  languageCount() {
    return this._engine.wasm._wl_i18n_languageCount();
  }
  languageIndex(code) {
    let wasm = this._engine.wasm;
    return wasm._wl_i18n_languageIndex(wasm.tempUTF8(code));
  }
  languageCode(index) {
    let wasm = this._engine.wasm, code = wasm._wl_i18n_languageCode(index);
    return code === 0 ? null : wasm.UTF8ToString(code);
  }
  languageName(index) {
    let wasm = this._engine.wasm, name = wasm._wl_i18n_languageName(index);
    return name === 0 ? null : wasm.UTF8ToString(name);
  }
  get engine() {
    return this._engine;
  }
};
var XR = class {
  #wasm;
  #mode;
  constructor(wasm, mode) {
    this.#wasm = wasm, this.#mode = mode;
  }
  get sessionMode() {
    return this.#mode;
  }
  get session() {
    return this.#wasm.webxr_session;
  }
  get frame() {
    return this.#wasm.webxr_frame;
  }
  referenceSpaceForType(type) {
    return this.#wasm.webxr_refSpaces[type] ?? null;
  }
  set currentReferenceSpace(refSpace) {
    this.#wasm.webxr_refSpace = refSpace, this.#wasm.webxr_refSpaceType = null;
    for (let type of Object.keys(this.#wasm.webxr_refSpaces))
      this.#wasm.webxr_refSpaces[type] === refSpace && (this.#wasm.webxr_refSpaceType = type);
  }
  get currentReferenceSpace() {
    return this.#wasm.webxr_refSpace;
  }
  get currentReferenceSpaceType() {
    return this.#wasm.webxr_refSpaceType;
  }
  get baseLayer() {
    return this.#wasm.webxr_baseLayer;
  }
  get framebuffers() {
    return Array.isArray(this.#wasm.webxr_fbo) ? this.#wasm.webxr_fbo.map((id) => this.#wasm.GL.framebuffers[id]) : [this.#wasm.GL.framebuffers[this.#wasm.webxr_fbo]];
  }
};
var Environment = class {
  _scene;
  constructor(scene) {
    this._scene = scene;
  }
  get intensity() {
    return this._scene.engine.wasm._wl_scene_environment_get_intensity(this._scene._index);
  }
  set intensity(intensity) {
    this._scene.engine.wasm._wl_scene_environment_set_intensity(this._scene._index, intensity);
  }
  getTint(out = new Float32Array(3)) {
    let wasm = this._scene.engine.wasm;
    return wasm._wl_scene_environment_get_tint(this._scene._index, wasm._tempMem), out[0] = wasm._tempMemFloat[0], out[1] = wasm._tempMemFloat[1], out[2] = wasm._tempMemFloat[2], out;
  }
  get tint() {
    return this.getTint();
  }
  setTint(v) {
    this._scene.engine.wasm._wl_scene_environment_set_tint(this._scene._index, v[0], v[1], v[2]);
  }
  set tint(v) {
    this.setTint(v);
  }
  getCoefficients(out = new Float32Array(3 * 9)) {
    let wasm = this._scene.engine.wasm;
    wasm.requireTempMem(3 * 9 * 4), wasm._wl_scene_environment_get_coefficients(this._scene._index, wasm._tempMem);
    for (let i = 0; i < 3 * 9; ++i)
      out[i] = wasm._tempMemFloat[i];
    return out;
  }
  get coefficients() {
    return this.getCoefficients();
  }
  setCoefficients(v) {
    let count = v.length / 3;
    count > 9 ? count = 9 : count > 4 && count < 9 ? count = 4 : count > 1 && count < 4 && (count = 1);
    let wasm = this._scene.engine.wasm;
    wasm._tempMemFloat.set(v), wasm._wl_scene_environment_set_coefficients(this._scene._index, wasm._tempMem, count);
  }
  set coefficients(v) {
    this.setCoefficients(v);
  }
};
var MaterialParamType = ((MaterialParamType2) => (MaterialParamType2[MaterialParamType2.UnsignedInt = 0] = "UnsignedInt", MaterialParamType2[MaterialParamType2.Int = 1] = "Int", MaterialParamType2[MaterialParamType2.HalfFloat = 2] = "HalfFloat", MaterialParamType2[MaterialParamType2.Float = 3] = "Float", MaterialParamType2[MaterialParamType2.Sampler = 4] = "Sampler", MaterialParamType2[MaterialParamType2.Font = 5] = "Font", MaterialParamType2))(MaterialParamType || {});
var _a11;
var Material = (_a11 = class extends Resource {
  constructor(engine2, params) {
    if (typeof params != "number") {
      if (!params?.pipeline)
        throw new Error("Missing parameter 'pipeline'");
      let template = engine2.materials.getTemplate(params.pipeline), material = new template();
      return super(engine2, material._index), material;
    }
    super(engine2, params);
  }
  hasParameter(name) {
    let parameters = this.constructor.Parameters;
    return parameters && parameters.has(name);
  }
  get shader() {
    return this.pipeline;
  }
  get pipeline() {
    let wasm = this.engine.wasm;
    return wasm.UTF8ToString(wasm._wl_material_get_pipeline(this._id));
  }
  clone() {
    let index = this.engine.wasm._wl_material_clone(this._id);
    return this.engine.materials.wrap(index);
  }
  toString() {
    return this.isDestroyed ? "Material(destroyed)" : `Material('${this.pipeline}', ${this._index})`;
  }
  static wrap(engine2, index) {
    return engine2.materials.wrap(index);
  }
}, __publicField(_a11, "_destroyedPrototype", createDestroyedProxy2("material")), _a11);
var MaterialManager = class extends ResourceManager {
  _materialTemplates = [];
  constructor(engine2) {
    super(engine2, Material), this._cacheDefinitions();
  }
  wrap(index) {
    if (index <= 0)
      return null;
    let cached = this._cache[index];
    if (cached)
      return cached;
    let definition = this.engine.wasm._wl_material_get_definition(index), Template = this._materialTemplates[definition], material = new Template(index);
    return this._wrapInstance(material);
  }
  getTemplate(pipeline) {
    let wasm = this.engine.wasm, index = wasm._wl_get_material_definition_index(wasm.tempUTF8(pipeline));
    if (!index)
      throw new Error(`Pipeline '${pipeline}' doesn't exist in the scene`);
    return this._materialTemplates[index];
  }
  _wrapInstance(instance) {
    if (this._cache[instance.index] = instance, !this.engine.legacyMaterialSupport)
      return instance;
    let proxy = new Proxy(instance, { get(target, prop) {
      if (!target.hasParameter(prop))
        return target[prop];
      let name = `get${capitalizeFirstUTF8(prop)}`;
      return target[name]();
    }, set(target, prop, value) {
      if (!target.hasParameter(prop))
        return target[prop] = value, true;
      let name = `set${capitalizeFirstUTF8(prop)}`;
      return target[name](value), true;
    } });
    return this._cache[instance.index] = proxy, proxy;
  }
  _cacheDefinitions() {
    let count = this.engine.wasm._wl_get_material_definition_count();
    for (let i = 0; i < count; ++i)
      this._materialTemplates[i] = this._createMaterialTemplate(i);
  }
  _createMaterialTemplate(definitionIndex) {
    let engine2 = this.engine, template = class extends Material {
      static Parameters = /* @__PURE__ */ new Set();
      constructor(index) {
        return index = index ?? engine2.wasm._wl_material_create(definitionIndex), super(engine2, index), engine2.materials._wrapInstance(this);
      }
    }, wasm = this.engine.wasm, nbParams = wasm._wl_material_definition_get_param_count(definitionIndex);
    for (let index = 0; index < nbParams; ++index) {
      let name = wasm.UTF8ToString(wasm._wl_material_definition_get_param_name(definitionIndex, index));
      template.Parameters.add(name);
      let t = wasm._wl_material_definition_get_param_type(definitionIndex, index), type = t & 255, componentCount = t >> 8 & 255, capitalized = capitalizeFirstUTF8(name), getterId = `get${capitalized}`, setterId = `set${capitalized}`, templateProto = template.prototype;
      switch (type) {
        case 0:
          templateProto[getterId] = uint32Getter(index, componentCount), templateProto[setterId] = uint32Setter(index);
          break;
        case 1:
          templateProto[getterId] = int32Getter(index, componentCount), templateProto[setterId] = uint32Setter(index);
          break;
        case 2:
        case 3:
          templateProto[getterId] = float32Getter(index, componentCount), templateProto[setterId] = float32Setter(index);
          break;
        case 4:
          templateProto[getterId] = samplerGetter(index), templateProto[setterId] = samplerSetter(index);
          break;
        case 5:
          templateProto[getterId] = fontGetter(index);
          break;
      }
    }
    return template;
  }
};
function uint32Getter(index, count) {
  return count === 1 ? function() {
    let wasm = this.engine.wasm;
    return wasm._wl_material_get_param_value(this._id, index, wasm._tempMem), wasm._tempMemUint32[0];
  } : function(out = new Uint32Array(count)) {
    let wasm = this.engine.wasm;
    wasm._wl_material_get_param_value(this._id, index, wasm._tempMem);
    for (let i = 0; i < out.length; ++i)
      out[i] = wasm._tempMemUint32[i];
    return out;
  };
}
function uint32Setter(index) {
  return function(value) {
    this.engine.wasm._wl_material_set_param_value_uint(this._id, index, value);
  };
}
function int32Getter(index, count) {
  return count === 1 ? function() {
    let wasm = this.engine.wasm;
    return wasm._wl_material_get_param_value(this._id, index, wasm._tempMem), wasm._tempMemInt[0];
  } : function(out = new Int32Array(count)) {
    let wasm = this.engine.wasm;
    wasm._wl_material_get_param_value(this._id, index, wasm._tempMem);
    for (let i = 0; i < out.length; ++i)
      out[i] = wasm._tempMemInt[i];
    return out;
  };
}
function float32Getter(index, count) {
  return count === 1 ? function() {
    let wasm = this.engine.wasm;
    return wasm._wl_material_get_param_value(this._id, index, wasm._tempMem), wasm._tempMemFloat[0];
  } : function(out = new Float32Array(count)) {
    let wasm = this.engine.wasm;
    wasm._wl_material_get_param_value(this._id, index, wasm._tempMem);
    for (let i = 0; i < out.length; ++i)
      out[i] = wasm._tempMemFloat[i];
    return out;
  };
}
function float32Setter(index) {
  return function(value) {
    let wasm = this.engine.wasm, count = 1;
    if (typeof value == "number")
      wasm._tempMemFloat[0] = value;
    else {
      count = value.length;
      for (let i = 0; i < count; ++i)
        wasm._tempMemFloat[i] = value[i];
    }
    wasm._wl_material_set_param_value_float(this._id, index, wasm._tempMem, count);
  };
}
function samplerGetter(index) {
  return function() {
    let wasm = this.engine.wasm;
    return wasm._wl_material_get_param_value(this._id, index, wasm._tempMem), this.engine.textures.wrap(wasm._tempMemInt[0]);
  };
}
function samplerSetter(index) {
  return function(value) {
    this.engine.wasm._wl_material_set_param_value_uint(this._id, index, value?._id ?? 0);
  };
}
function fontGetter(index) {
  return function() {
    let wasm = this.engine.wasm;
    return wasm._wl_material_get_param_value(this._id, index, wasm._tempMem), this.engine.fonts.wrap(wasm._tempMemInt[0]);
  };
}
var MeshManager = class extends ResourceManager {
  constructor(engine2) {
    super(engine2, Mesh);
  }
  create(params) {
    if (!params.vertexCount)
      throw new Error("Missing parameter 'vertexCount'");
    let wasm = this.engine.wasm, indexData = 0, indexType = 0, indexDataSize = 0;
    if (params.indexData)
      switch (indexType = params.indexType || 2, indexDataSize = params.indexData.length * indexType, indexData = wasm._malloc(indexDataSize), indexType) {
        case 1:
          wasm.HEAPU8.set(params.indexData, indexData);
          break;
        case 2:
          wasm.HEAPU16.set(params.indexData, indexData >> 1);
          break;
        case 4:
          wasm.HEAPU32.set(params.indexData, indexData >> 2);
          break;
      }
    let { skinningType = 0 } = params, index = wasm._wl_mesh_create(indexData, indexDataSize, indexType, params.vertexCount, skinningType), instance = new Mesh(this._host, index);
    return this._cache[instance.index] = instance, instance;
  }
};
var TextureManager = class extends ResourceManager {
  constructor(engine2) {
    super(engine2, Texture);
  }
  create(image) {
    let wasm = this.engine.wasm, jsImageIndex = wasm._images.length;
    if (wasm._images.push(image), image instanceof HTMLImageElement && !image.complete)
      throw new Error("image must be ready to create a texture");
    let width = image.videoWidth ?? image.width, height = image.videoHeight ?? image.height, imageIndex = wasm._wl_image_create(jsImageIndex, width, height), index = wasm._wl_texture_create(imageIndex), instance = new Texture(this.engine, index);
    return this._cache[instance.index] = instance, instance;
  }
  load(filename, crossOrigin) {
    let image = new Image();
    return image.crossOrigin = crossOrigin ?? image.crossOrigin, image.src = filename, new Promise((resolve, reject) => {
      image.onload = () => {
        resolve(this.create(image));
      }, image.onerror = function() {
        reject("Failed to load image. Not found or no read access");
      };
    });
  }
};
var GLTFExtensions = class {
  objectCount;
  root = {};
  mesh = {};
  node = {};
  constructor(count) {
    this.objectCount = count;
  }
};
var PrefabGLTF = class extends Prefab {
  extensions = null;
  constructor(engine2, index) {
    super(engine2, index), this.extensions = this._readExtensions();
  }
  _processInstantiaton(dest, root, result) {
    if (!this.extensions)
      return null;
    let wasm = this.engine.wasm, count = this.extensions.objectCount, idMapping = new Array(count), activeRootIndex = wasm._wl_object_index(root._id);
    for (let i = 0; i < count; ++i) {
      let mappedId = wasm._wl_glTF_scene_extensions_gltfIndex_to_id(this._index, dest._index, activeRootIndex, i);
      idMapping[i] = mappedId;
    }
    let remapped = { mesh: {}, node: {}, idMapping };
    for (let gltfIndex in this.extensions.mesh) {
      let id = idMapping[gltfIndex];
      remapped.mesh[id] = this.extensions.mesh[gltfIndex];
    }
    for (let gltfIndex in this.extensions.node) {
      let id = idMapping[gltfIndex];
      remapped.node[id] = this.extensions.node[gltfIndex];
    }
    result.extensions = remapped;
  }
  _readExtensions() {
    let wasm = this.engine.wasm, ptr = wasm._wl_glTF_scene_get_extensions(this._index);
    if (!ptr)
      return null;
    let index = ptr / 4, data = wasm.HEAPU32, readString = () => {
      let strPtr = data[index++], strLen = data[index++];
      return wasm.UTF8ViewToString(strPtr, strPtr + strLen);
    }, objectCount = data[index++], extensions = new GLTFExtensions(objectCount), meshExtensionsSize = data[index++];
    for (let i = 0; i < meshExtensionsSize; ++i) {
      let objectId = data[index++];
      extensions.mesh[objectId] = JSON.parse(readString());
    }
    let nodeExtensionsSize = data[index++];
    for (let i = 0; i < nodeExtensionsSize; ++i) {
      let objectId = data[index++];
      extensions.node[objectId] = JSON.parse(readString());
    }
    let rootExtensionsStr = readString();
    return rootExtensionsStr && (extensions.root = JSON.parse(rootExtensionsStr)), extensions;
  }
};
var MAGIC_BIN = "WLEV";
var SceneType = ((SceneType2) => (SceneType2[SceneType2.Prefab = 0] = "Prefab", SceneType2[SceneType2.Main = 1] = "Main", SceneType2[SceneType2.Dependency = 2] = "Dependency", SceneType2))(SceneType || {});
var ChunkedSceneLoadSink = class {
  #wasm;
  #type;
  #closeParameters;
  #offset = 0;
  #requested = 0;
  #firstChunk = true;
  _loadIndex = -1;
  sceneIndex = -1;
  #ptr = 0;
  #bufferSize = 0;
  constructor(engine2, type, url, ...closeParameters) {
    this.#wasm = engine2.wasm, this.#type = type, this.#closeParameters = closeParameters, this._loadIndex = this.#wasm._wl_scene_create_chunked_start(this.#wasm.tempUTF8(url)), this.#requested = this.#wasm._wl_scene_create_chunked_buffer_size(this._loadIndex), this._resizeBuffer(this.#requested);
  }
  _resizeBuffer(size) {
    this.#bufferSize > 0 && this.#wasm._free(this.#ptr), this.#bufferSize = size, this.#ptr = size ? this.#wasm._malloc(size) : 0;
  }
  _throwError(reason) {
    throw this.abort(), new Error(reason);
  }
  write(blob) {
    let read = 0;
    for (; read < blob.length; ) {
      let toRead = Math.min(blob.length - read, this.#bufferSize - this.#offset);
      if (this.#wasm.HEAPU8.set(blob.subarray(read, read + toRead), this.#ptr + this.#offset), this.#offset += toRead, read += toRead, this.#requested > this.#offset)
        continue;
      let readSizePtr = this.#wasm._tempMem, requestedPtr = this.#wasm._tempMem + 4, success;
      try {
        success = this.#wasm._wl_scene_create_chunked_next(this._loadIndex, this.#ptr, this.#offset, readSizePtr, requestedPtr);
      } catch {
        success = false;
      }
      success || this._throwError("Chunk parsing failed");
      let sentSize = this.#offset, readSize = this.#wasm._tempMemUint32[0];
      this.#requested = this.#wasm._tempMemUint32[1];
      let extraSize = sentSize - readSize;
      extraSize > this.#requested && this._throwError("Unexpected extra data"), readSize && (extraSize > 0 && this.#wasm.HEAPU8.copyWithin(this.#ptr, this.#ptr + readSize, this.#ptr + sentSize), this.#offset = extraSize, this.#firstChunk && (this._resizeBuffer(this.#wasm._wl_scene_create_chunked_buffer_size(this._loadIndex)), this.#firstChunk = false));
    }
  }
  close() {
    switch (this.#requested > 0 && this._throwError("Unexpected end of data"), this._resizeBuffer(0), this.#type) {
      case 0:
        this.sceneIndex = this.#wasm._wl_scene_create_chunked_end_prefab(this._loadIndex);
        break;
      case 1:
        this.#wasm._wl_scene_create_chunked_end_main(this._loadIndex), this.sceneIndex = 0;
        break;
      case 2:
        [this.sceneIndex] = this.#closeParameters, this.#wasm._wl_scene_create_chunked_end_queued(this._loadIndex, this.sceneIndex);
        break;
      default:
        this.#wasm._wl_scene_create_chunked_abort(this._loadIndex);
        break;
    }
    this._loadIndex = -1;
  }
  abort() {
    this._loadIndex !== -1 && (this.#wasm._wl_scene_create_chunked_abort(this._loadIndex), this._loadIndex = -1, this._resizeBuffer(0));
  }
  get size() {
    return this.#bufferSize;
  }
};
var Scene = class _Scene extends Prefab {
  onPreRender = new Emitter();
  onPostRender = new Emitter();
  _rayHit;
  _hit;
  _environment;
  constructor(engine2, index) {
    super(engine2, index), this._rayHit = this.engine?.wasm._malloc(4 * (3 * 4 + 3 * 4 + 4 + 2) + 4), this._hit = new RayHit(this, this._rayHit), this._environment = new Environment(this);
  }
  instantiate(prefab) {
    let id = this.engine.wasm._wl_scene_instantiate(prefab._index, this._index), result = { root: this.wrap(id) };
    if (prefab instanceof PrefabGLTF) {
      let obj = this.wrap(id);
      prefab._processInstantiaton(this, obj, result);
    }
    return result;
  }
  destroy() {
    if (this.isActive)
      throw new Error(`Attempt to destroy ${this}, but destroying the active scene is not supported`);
    let wasm = this.engine.wasm, rayPtr = this._rayHit;
    super.destroy(), wasm._free(rayPtr);
  }
  get activeViews() {
    let wasm = this.engine.wasm, count = wasm._wl_scene_get_active_views(this._index, wasm._tempMem, 16), views = [];
    for (let i = 0; i < count; ++i) {
      let id = wasm._tempMemInt[i];
      views.push(this._components.wrapView(id));
    }
    return views;
  }
  rayCast(o, d, groupMask, maxDistance = 100) {
    return this.engine.wasm._wl_scene_ray_cast(this._index, o[0], o[1], o[2], d[0], d[1], d[2], groupMask, this._rayHit, maxDistance), this._hit;
  }
  set clearColor(color) {
    this.engine.wasm._wl_scene_set_clearColor(color[0], color[1], color[2], color[3]);
  }
  set colorClearEnabled(b) {
    this.engine.wasm._wl_scene_enableColorClear(b);
  }
  async load(options) {
    let engine2 = this.engine, dispatchReadyEvent = false, opts;
    isString(options) ? opts = await _Scene.loadBuffer(options, (bytes, size) => {
      this.engine.log.info(1, `Scene downloading: ${bytes} / ${size}`), this.engine.setLoadingProgress(bytes / size);
    }) : (opts = options, dispatchReadyEvent = options.dispatchReadyEvent ?? false);
    let scene = await engine2.loadMainSceneFromBuffer({ ...opts, dispatchReadyEvent });
    return engine2.onSceneLoaded.notify(), scene;
  }
  async append(file, options = {}) {
    let { baseURL = isString(file) ? getBaseUrl(file) : this.baseURL } = options, buffer = isString(file) ? await fetchWithProgress(file) : file, data = new Uint8Array(buffer), scene = data.byteLength > MAGIC_BIN.length && data.subarray(0, MAGIC_BIN.length).every((value, i) => value === MAGIC_BIN.charCodeAt(i)) ? this.engine.loadPrefabFromBuffer({ buffer, baseURL }) : this.engine.loadGLTFFromBuffer({ buffer, baseURL, extensions: options.loadGltfExtensions }), result = this.instantiate(scene);
    return scene instanceof PrefabGLTF ? scene.extensions ? { root: result.root, extensions: { ...result.extensions, root: scene.extensions.root } } : result.root : (scene.destroy(), result.root);
  }
  setLoadingProgress(percentage) {
    this.engine.setLoadingProgress(percentage);
  }
  dispatchReadyEvent() {
    document.dispatchEvent(new CustomEvent("wle-scene-ready", { detail: { filename: this.filename } }));
  }
  set skyMaterial(material) {
    this.engine.wasm._wl_scene_set_sky_material(this._index, material?._id ?? 0);
  }
  get skyMaterial() {
    let index = this.engine.wasm._wl_scene_get_sky_material(this._index);
    return this.engine.materials.wrap(index);
  }
  get environment() {
    return this._environment;
  }
  reset() {
  }
  async _downloadDependency(url) {
    if (this.engine._canUseChunkLoading()) {
      let sink = new ChunkedSceneLoadSink(this.engine, 2, url, this._index);
      await (await fetchStreamWithProgress(url)).pipeTo(new WritableStream(sink));
    } else {
      let wasm = this.engine.wasm, buffer = await fetchWithProgress(url), ptr = wasm.copyBufferToHeap(buffer);
      try {
        wasm._wl_scene_load_queued_bin(this._index, ptr, buffer.byteLength);
      } finally {
        wasm._free(ptr);
      }
    }
  }
  async _downloadDependencies() {
    let wasm = this.engine.wasm, count = wasm._wl_scene_queued_bin_count(this._index);
    if (!count)
      return Promise.resolve();
    let urls = new Array(count).fill(0).map((_, i) => {
      let ptr = wasm._wl_scene_queued_bin_path(this._index, i);
      return wasm.UTF8ToString(ptr);
    });
    return wasm._wl_scene_clear_queued_bin_list(this._index), Promise.all(urls.map((url) => this._downloadDependency(url)));
  }
};
function checkXRSupport() {
  if (!navigator.xr) {
    let isLocalhost = location.hostname === "localhost" || location.hostname === "127.0.0.1", missingHTTPS = location.protocol !== "https:" && !isLocalhost;
    return Promise.reject(missingHTTPS ? "WebXR is only supported with HTTPS or on localhost!" : "WebXR unsupported in this browser.");
  }
  return Promise.resolve();
}
var WonderlandEngine = class {
  onXRSessionEnd = new Emitter();
  onXRSessionStart = new RetainEmitter();
  onResize = new Emitter();
  arSupported = false;
  vrSupported = false;
  onLoadingScreenEnd = new RetainEmitter();
  onSceneLoaded = new Emitter();
  onSceneActivated = new Emitter();
  onHotReloadRequest = new Emitter();
  i18n = new I18N(this);
  xr = null;
  erasePrototypeOnDestroy = false;
  legacyMaterialSupport = true;
  _useChunkLoading = true;
  _scenes = [];
  _scene = null;
  _textures = null;
  _materials = null;
  _meshes = null;
  _morphTargets = null;
  _fonts = null;
  #wasm;
  #physics = null;
  #resizeObserver = null;
  #initialReferenceSpaceType = null;
  constructor(wasm, loadingScreen) {
    this.#wasm = wasm, this.#wasm._setEngine(this), this.#wasm._loadingScreen = loadingScreen, this.canvas.addEventListener("webglcontextlost", (e) => this.log.error(0, "Context lost:", e), false);
  }
  start() {
    this.wasm._wl_application_start();
  }
  registerComponent(...classes) {
    for (let arg of classes)
      this.wasm._registerComponent(arg);
  }
  setLoadingProgress(percentage) {
    this.wasm._wl_set_loading_screen_progress(clamp(percentage, 0, 1));
  }
  async switchTo(scene, opts = {}) {
    this.wasm._wl_deactivate_activeScene();
    let previous = this.scene;
    this._preactivate(scene), this.wasm._wl_scene_activate(scene._index), this.onLoadingScreenEnd.isDataRetained || this.onLoadingScreenEnd.notify();
    let promise = scene._downloadDependencies();
    await this.i18n.setLanguage(this.i18n.languageCode(0));
    let { dispatchReadyEvent = false, waitForDependencies = false } = opts;
    waitForDependencies && await promise, this.onSceneActivated.notify(previous, scene), dispatchReadyEvent && scene.dispatchReadyEvent();
  }
  async loadMainScene(options, progress) {
    progress ??= (bytes, size) => {
      this.log.info(1, `Scene downloading: ${bytes} / ${size}`), this.setLoadingProgress(bytes / size);
    };
    let opts = Prefab.makeUrlLoadOptions(options), { streamed = true } = opts;
    if (this._canUseChunkLoading() && streamed) {
      let options2 = await Scene.loadStream(opts, progress), { stream, url } = Prefab.validateStreamOptions(options2);
      return this._loadMainScene(stream, url, options2);
    } else {
      let options2 = await Scene.loadBuffer(opts, progress);
      return this.loadMainSceneFromBuffer(options2);
    }
  }
  async loadMainSceneFromBuffer(options) {
    let { buffer, url } = Prefab.validateBufferOptions(options);
    return this._loadMainScene(buffer, url, options);
  }
  async loadPrefab(options, progress) {
    let opts = Prefab.makeUrlLoadOptions(options), { streamed = true } = opts;
    if (this._canUseChunkLoading() && streamed) {
      let options2 = await Scene.loadStream(opts, progress), scene = await this._loadSceneFromStream(Prefab, options2);
      return this._validateLoadedPrefab(scene), scene._initialize(), scene;
    } else {
      let options2 = await Scene.loadBuffer(opts, progress);
      return this.loadPrefabFromBuffer(options2);
    }
  }
  loadPrefabFromBuffer(options) {
    let scene = this._loadSceneFromBuffer(Prefab, options);
    return this._validateLoadedPrefab(scene), scene._initialize(), scene;
  }
  async loadScene(options, progress) {
    let opts = Prefab.makeUrlLoadOptions(options), { streamed = true } = opts;
    if (this._canUseChunkLoading() && streamed) {
      let options2 = await Scene.loadStream(opts, progress), scene = await this._loadSceneFromStream(Scene, options2);
      return this._validateLoadedScene(scene), scene._initialize(), scene;
    } else {
      let options2 = await Scene.loadBuffer(opts, progress);
      return this.loadSceneFromBuffer(options2);
    }
  }
  async loadGLTF(opts, progress) {
    let memOptions = await Scene.loadBuffer(opts, progress), options = isString(opts) ? memOptions : { ...opts, ...memOptions };
    return this.loadGLTFFromBuffer(options);
  }
  loadSceneFromBuffer(options) {
    let scene = this._loadSceneFromBuffer(Scene, options);
    return this._validateLoadedScene(scene), scene._initialize(), scene;
  }
  loadGLTFFromBuffer(options) {
    Scene.validateBufferOptions(options);
    let { buffer, extensions = false } = options, wasm = this.wasm;
    if (!wasm._wl_glTF_scene_create)
      throw new Error("Loading .gltf files requires `enableRuntimeGltf` to be checked in the editor Project Settings.");
    let ptr = wasm.copyBufferToHeap(buffer);
    try {
      let index = wasm._wl_glTF_scene_create(extensions, ptr, buffer.byteLength), scene = new PrefabGLTF(this, index);
      return this._scenes[scene._index] = scene, scene;
    } finally {
      wasm._free(ptr);
    }
  }
  isRegistered(typeOrClass) {
    return this.#wasm.isRegistered(isString(typeOrClass) ? typeOrClass : typeOrClass.TypeName);
  }
  resize(width, height, devicePixelRatio = window.devicePixelRatio) {
    width = width * devicePixelRatio, height = height * devicePixelRatio, this.canvas.width = width, this.canvas.height = height, this.wasm._wl_application_resize(width, height), this.onResize.notify();
  }
  nextFrame(fixedDelta = 0) {
    this.#wasm._wl_nextFrame(fixedDelta);
  }
  requestXRSession(mode, features, optionalFeatures = []) {
    return checkXRSupport().then(() => this.#wasm.webxr_requestSession(mode, features, optionalFeatures));
  }
  offerXRSession(mode, features, optionalFeatures = []) {
    return checkXRSupport().then(() => this.#wasm.webxr_offerSession(mode, features, optionalFeatures));
  }
  wrapObject(objectId) {
    return this.scene.wrap(objectId);
  }
  toString() {
    return "engine";
  }
  get scene() {
    return this._scene;
  }
  get wasm() {
    return this.#wasm;
  }
  get canvas() {
    return this.#wasm.canvas;
  }
  get xrSession() {
    return this.xr?.session ?? null;
  }
  get xrFrame() {
    return this.xr?.frame ?? null;
  }
  get xrBaseLayer() {
    return this.xr?.baseLayer ?? null;
  }
  get xrFramebuffer() {
    return this.xr?.framebuffers[0] ?? null;
  }
  get xrFramebufferScaleFactor() {
    return this.#wasm.webxr_framebufferScaleFactor;
  }
  set xrFramebufferScaleFactor(value) {
    this.#wasm.webxr_framebufferScaleFactor = value;
  }
  get physics() {
    return this.#physics;
  }
  get textures() {
    return this._textures;
  }
  get materials() {
    return this._materials;
  }
  get meshes() {
    return this._meshes;
  }
  get morphTargets() {
    return this._morphTargets;
  }
  get fonts() {
    return this._fonts;
  }
  get images() {
    let wasm = this.wasm, max2 = wasm._tempMemSize >> 1, count = wasm._wl_get_images(wasm._tempMem, max2), result = new Array(count);
    for (let i = 0; i < count; ++i) {
      let index = wasm._tempMemUint16[i];
      result[i] = wasm._images[index];
    }
    return result;
  }
  get imagesPromise() {
    let promises = this.images.map((i) => onImageReady(i));
    return Promise.all(promises);
  }
  get isTextureStreamingIdle() {
    return !!this.wasm._wl_renderer_streaming_idle();
  }
  set autoResizeCanvas(flag) {
    if (!!this.#resizeObserver !== flag) {
      if (!flag) {
        this.#resizeObserver?.unobserve(this.canvas), this.#resizeObserver = null;
        return;
      }
      this.#resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries)
          entry.target === this.canvas && this.resize(entry.contentRect.width, entry.contentRect.height);
      }), this.#resizeObserver.observe(this.canvas);
    }
  }
  get autoResizeCanvas() {
    return this.#resizeObserver !== null;
  }
  get runtimeVersion() {
    let wasm = this.#wasm;
    return wasm._wl_application_version(wasm._tempMem), { major: wasm._tempMemUint16[0], minor: wasm._tempMemUint16[1], patch: wasm._tempMemUint16[2], rc: wasm._tempMemUint16[3] };
  }
  get log() {
    return this.#wasm._log;
  }
  _init() {
    let onXRStart = () => {
      this.#initialReferenceSpaceType = this.xr.currentReferenceSpaceType;
      let newSpace = this.xr.referenceSpaceForType("local") ?? this.xr.referenceSpaceForType("viewer");
      this.xr.currentReferenceSpace = newSpace;
    };
    if (this.onXRSessionStart.add(onXRStart), this.onLoadingScreenEnd.once(() => {
      this.onXRSessionStart.remove(onXRStart), !(!this.xr || !this.#initialReferenceSpaceType) && (this.xr.currentReferenceSpace = this.xr.referenceSpaceForType(this.#initialReferenceSpaceType) ?? this.xr.referenceSpaceForType("viewer"), this.#initialReferenceSpaceType = null);
    }), this.#wasm._wl_set_error_callback(this.#wasm.addFunction((messagePtr) => {
      throw new Error(this.#wasm.UTF8ToString(messagePtr));
    }, "vi")), this.#physics = null, this.#wasm.withPhysX) {
      let physics = new Physics(this);
      this.#wasm._wl_physx_set_collision_callback(this.#wasm.addFunction((a, index, type, b) => {
        let physxA = this.scene._components.wrapPhysx(a), physxB = this.scene._components.wrapPhysx(b), callback = this.scene._pxCallbacks.get(physxA._id)[index];
        callback(type, physxB);
      }, "viiii")), this.#physics = physics;
    }
    this.resize(this.canvas.clientWidth, this.canvas.clientHeight), this._scene = this._reload(0);
  }
  _reset() {
    return this.wasm.reset(), this._scenes.length = 0, this._scene = this._reload(0), this.switchTo(this._scene);
  }
  _createEmpty() {
    let index = this.wasm._wl_scene_create_empty(), scene = new Scene(this, index);
    return this._scenes[index] = scene, scene;
  }
  _destroyScene(instance) {
    this.wasm._wl_scene_destroy(instance._index);
    let index = instance._index;
    instance._index = -1, this.erasePrototypeOnDestroy && Object.setPrototypeOf(instance, DestroyedPrefabInstance), this._scenes[index] = null;
  }
  _reload(index) {
    let scene = new Scene(this, index);
    return this._scenes[index] = scene, this._textures = new TextureManager(this), this._materials = new MaterialManager(this), this._meshes = new MeshManager(this), this._morphTargets = new ResourceManager(this, MorphTargets), this._fonts = new ResourceManager(this, Font), scene;
  }
  async _loadMainScene(data, url, options) {
    let wasm = this.#wasm;
    wasm._wl_deactivate_activeScene();
    for (let i = this._scenes.length - 1; i >= 0; --i) {
      let scene = this._scenes[i];
      scene && scene.destroy();
    }
    this._textures._clear(), this._materials._clear(), this._meshes._clear(), this._morphTargets._clear();
    let index = -1;
    if (this._canUseChunkLoading()) {
      let stream = data instanceof ReadableStream ? data : new ReadableStream(new ArrayBufferSource(data)), sink = new ChunkedSceneLoadSink(this, 1, url);
      await stream.pipeTo(new WritableStream(sink)), index = sink.sceneIndex;
    } else {
      let buffer;
      if (data instanceof ReadableStream) {
        let sink = new ArrayBufferSink();
        await data.pipeTo(new WritableStream(sink)), buffer = sink.arrayBuffer;
      } else
        buffer = data;
      let ptr = wasm.copyBufferToHeap(buffer);
      try {
        index = wasm._wl_load_main_scene(ptr, buffer.byteLength, wasm.tempUTF8(url));
      } finally {
        wasm._free(ptr);
      }
      if (index === -1)
        throw new Error("Failed to load main scene");
    }
    let mainScene = this._reload(index);
    return this._preactivate(mainScene), mainScene._initialize(), await this.switchTo(mainScene, options), mainScene;
  }
  _loadSceneFromBuffer(PrefabClass, options) {
    let { buffer, url } = Scene.validateBufferOptions(options), index = -1;
    if (this._canUseChunkLoading()) {
      let sink = new ChunkedSceneLoadSink(this, 0, url);
      sink.write(new Uint8Array(buffer)), sink.close(), index = sink.sceneIndex;
    } else {
      let wasm = this.wasm, ptr = wasm.copyBufferToHeap(buffer);
      try {
        index = wasm._wl_scene_create(ptr, buffer.byteLength, wasm.tempUTF8(url));
      } finally {
        wasm._free(ptr);
      }
      if (!index)
        throw new Error("Failed to parse scene");
    }
    let scene = new PrefabClass(this, index);
    return this._scenes[index] = scene, scene;
  }
  async _loadSceneFromStream(PrefabClass, options) {
    let { stream, url } = Scene.validateStreamOptions(options), index = -1;
    if (this._canUseChunkLoading()) {
      let sink = new ChunkedSceneLoadSink(this, 0, url);
      await stream.pipeTo(new WritableStream(sink)), index = sink.sceneIndex;
    } else {
      let sink = new ArrayBufferSink();
      await stream.pipeTo(new WritableStream(sink));
      let buffer = sink.arrayBuffer, wasm = this.wasm, ptr = wasm.copyBufferToHeap(buffer);
      try {
        index = wasm._wl_scene_create(ptr, buffer.byteLength, wasm.tempUTF8(url));
      } finally {
        wasm._free(ptr);
      }
      if (!index)
        throw new Error("Failed to parse scene");
    }
    let scene = new PrefabClass(this, index);
    return this._scenes[index] = scene, scene;
  }
  _validateLoadedPrefab(scene) {
    if (this.wasm._wl_scene_activatable(scene._index))
      throw this.wasm._wl_scene_destroy(scene._index), new Error("File is not a prefab. To load a scene, use loadScene() instead");
  }
  _validateLoadedScene(scene) {
    if (!this.wasm._wl_scene_activatable(scene._index))
      throw this.wasm._wl_scene_destroy(scene._index), new Error("File is not a scene. To load a prefab, use loadPrefab() instead");
  }
  _canUseChunkLoading() {
    return this._useChunkLoading && (this.runtimeVersion.minor > 2 || this.runtimeVersion.patch >= 1);
  }
  _preactivate(scene) {
    this._scene = scene, this.physics && (this.physics._hit._scene = scene);
  }
};
function assert(bit) {
  if (bit >= 32)
    throw new Error(`BitSet.enable(): Value ${bit} is over 31`);
}
var BitSet = class {
  _bits = 0;
  enable(...bits) {
    for (let bit of bits)
      assert(bit), this._bits |= 1 << bit >>> 0;
    return this;
  }
  enableAll() {
    return this._bits = -1, this;
  }
  disable(...bits) {
    for (let bit of bits)
      assert(bit), this._bits &= ~(1 << bit >>> 0);
    return this;
  }
  disableAll() {
    return this._bits = 0, this;
  }
  enabled(bit) {
    return !!(this._bits & 1 << bit >>> 0);
  }
};
var LogLevel = ((LogLevel2) => (LogLevel2[LogLevel2.Info = 0] = "Info", LogLevel2[LogLevel2.Warn = 1] = "Warn", LogLevel2[LogLevel2.Error = 2] = "Error", LogLevel2))(LogLevel || {});
var Logger = class {
  levels = new BitSet();
  tags = new BitSet().enableAll();
  constructor(...levels) {
    this.levels.enable(...levels);
  }
  info(tag, ...msg) {
    return this.levels.enabled(0) && this.tags.enabled(tag) && console.log(...msg), this;
  }
  warn(tag, ...msg) {
    return this.levels.enabled(1) && this.tags.enabled(tag) && console.warn(...msg), this;
  }
  error(tag, ...msg) {
    return this.levels.enabled(2) && this.tags.enabled(tag) && console.error(...msg), this;
  }
};
function decode(data, tagger = (_, value) => value, options = {}) {
  let { dictionary = "object" } = options, dataView = new DataView(data.buffer, data.byteOffset, data.byteLength), offset = 0;
  function commitRead(length2, value) {
    return offset += length2, value;
  }
  function readArrayBuffer(length2) {
    return commitRead(length2, data.subarray(offset, offset + length2));
  }
  function readFloat16() {
    let POW_2_24 = 5960464477539063e-23, tempArrayBuffer = new ArrayBuffer(4), tempDataView = new DataView(tempArrayBuffer), value = readUint16(), sign = value & 32768, exponent = value & 31744, fraction = value & 1023;
    if (exponent === 31744)
      exponent = 261120;
    else if (exponent !== 0)
      exponent += 114688;
    else if (fraction !== 0)
      return (sign ? -1 : 1) * fraction * POW_2_24;
    return tempDataView.setUint32(0, sign << 16 | exponent << 13 | fraction << 13), tempDataView.getFloat32(0);
  }
  function readFloat32() {
    return commitRead(4, dataView.getFloat32(offset));
  }
  function readFloat64() {
    return commitRead(8, dataView.getFloat64(offset));
  }
  function readUint8() {
    return commitRead(1, data[offset]);
  }
  function readUint16() {
    return commitRead(2, dataView.getUint16(offset));
  }
  function readUint32() {
    return commitRead(4, dataView.getUint32(offset));
  }
  function readUint64() {
    return commitRead(8, dataView.getBigUint64(offset));
  }
  function readBreak() {
    return data[offset] !== 255 ? false : (offset += 1, true);
  }
  function readLength(additionalInformation) {
    if (additionalInformation < 24)
      return additionalInformation;
    if (additionalInformation === 24)
      return readUint8();
    if (additionalInformation === 25)
      return readUint16();
    if (additionalInformation === 26)
      return readUint32();
    if (additionalInformation === 27) {
      let integer = readUint64();
      return integer <= Number.MAX_SAFE_INTEGER ? Number(integer) : integer;
    }
    if (additionalInformation === 31)
      return -1;
    throw new Error("CBORError: Invalid length encoding");
  }
  function readIndefiniteStringLength(majorType) {
    let initialByte = readUint8();
    if (initialByte === 255)
      return -1;
    let length2 = readLength(initialByte & 31);
    if (length2 < 0 || initialByte >> 5 !== majorType)
      throw new Error("CBORError: Invalid indefinite length element");
    return Number(length2);
  }
  function appendUtf16Data(utf16data, length2) {
    for (let i = 0; i < length2; ++i) {
      let value = readUint8();
      value & 128 && (value < 224 ? (value = (value & 31) << 6 | readUint8() & 63, length2 -= 1) : value < 240 ? (value = (value & 15) << 12 | (readUint8() & 63) << 6 | readUint8() & 63, length2 -= 2) : (value = (value & 7) << 18 | (readUint8() & 63) << 12 | (readUint8() & 63) << 6 | readUint8() & 63, length2 -= 3)), value < 65536 ? utf16data.push(value) : (value -= 65536, utf16data.push(55296 | value >> 10), utf16data.push(56320 | value & 1023));
    }
  }
  function decodeItem() {
    let initialByte = readUint8(), majorType = initialByte >> 5, additionalInformation = initialByte & 31, i, length2;
    if (majorType === 7)
      switch (additionalInformation) {
        case 25:
          return readFloat16();
        case 26:
          return readFloat32();
        case 27:
          return readFloat64();
      }
    if (length2 = readLength(additionalInformation), length2 < 0 && (majorType < 2 || 6 < majorType))
      throw new Error("CBORError: Invalid length");
    switch (majorType) {
      case 0:
        return length2;
      case 1:
        return typeof length2 == "number" ? -1 - length2 : -1n - length2;
      case 2: {
        if (length2 < 0) {
          let elements = [], fullArrayLength = 0;
          for (; (length2 = readIndefiniteStringLength(majorType)) >= 0; )
            fullArrayLength += length2, elements.push(readArrayBuffer(length2));
          let fullArray = new Uint8Array(fullArrayLength), fullArrayOffset = 0;
          for (i = 0; i < elements.length; ++i)
            fullArray.set(elements[i], fullArrayOffset), fullArrayOffset += elements[i].length;
          return fullArray;
        }
        return readArrayBuffer(length2).slice();
      }
      case 3: {
        let utf16data = [];
        if (length2 < 0)
          for (; (length2 = readIndefiniteStringLength(majorType)) >= 0; )
            appendUtf16Data(utf16data, length2);
        else
          appendUtf16Data(utf16data, length2);
        let string = "", DECODE_CHUNK_SIZE = 8192;
        for (i = 0; i < utf16data.length; i += DECODE_CHUNK_SIZE)
          string += String.fromCharCode.apply(null, utf16data.slice(i, i + DECODE_CHUNK_SIZE));
        return string;
      }
      case 4: {
        let retArray;
        if (length2 < 0) {
          retArray = [];
          let index = 0;
          for (; !readBreak(); )
            retArray.push(decodeItem());
        } else
          for (retArray = new Array(length2), i = 0; i < length2; ++i)
            retArray[i] = decodeItem();
        return retArray;
      }
      case 5: {
        if (dictionary === "map") {
          let retMap = /* @__PURE__ */ new Map();
          for (i = 0; i < length2 || length2 < 0 && !readBreak(); ++i) {
            let key = decodeItem();
            if (retMap.has(key))
              throw new Error("CBORError: Duplicate key encountered");
            retMap.set(key, decodeItem());
          }
          return retMap;
        }
        let retObject = {};
        for (i = 0; i < length2 || length2 < 0 && !readBreak(); ++i) {
          let key = decodeItem();
          if (Object.prototype.hasOwnProperty.call(retObject, key))
            throw new Error("CBORError: Duplicate key encountered");
          retObject[key] = decodeItem();
        }
        return retObject;
      }
      case 6: {
        let value = decodeItem(), tag = length2;
        if (value instanceof Uint8Array)
          switch (tag) {
            case 2:
            case 3:
              let num = value.reduce((acc, n) => (acc << 8n) + BigInt(n), 0n);
              return tag == 3 && (num = -1n - num), num;
            case 64:
              return value;
            case 72:
              return new Int8Array(value.buffer);
            case 69:
              return new Uint16Array(value.buffer);
            case 77:
              return new Int16Array(value.buffer);
            case 70:
              return new Uint32Array(value.buffer);
            case 78:
              return new Int32Array(value.buffer);
            case 71:
              return new BigUint64Array(value.buffer);
            case 79:
              return new BigInt64Array(value.buffer);
            case 85:
              return new Float32Array(value.buffer);
            case 86:
              return new Float64Array(value.buffer);
          }
        return tagger(tag, value);
      }
      case 7:
        switch (length2) {
          case 20:
            return false;
          case 21:
            return true;
          case 22:
            return null;
          case 23:
            return;
          default:
            return length2;
        }
    }
  }
  let ret = decodeItem();
  if (offset !== data.byteLength)
    throw new Error("CBORError: Remaining bytes");
  return ret;
}
var CBOR = { decode };
var _componentDefaults = /* @__PURE__ */ new Map([[1, false], [2, 0], [3, 0], [4, ""], [5, void 0], [6, null], [7, null], [8, null], [9, null], [10, null], [11, null], [12, Float32Array.from([0, 0, 0, 1])], [13, Float32Array.from([0, 0])], [14, Float32Array.from([0, 0, 0])], [15, Float32Array.from([0, 0, 0, 0])]]);
function _setupDefaults(ctor) {
  for (let name in ctor.Properties) {
    let p = ctor.Properties[name];
    if (p.type === 5)
      p.values?.length ? (typeof p.default != "number" && (p.default = p.values.indexOf(p.default)), (p.default < 0 || p.default >= p.values.length) && (p.default = 0)) : p.default = void 0;
    else if ((p.type === 12 || p.type === 13 || p.type === 14 || p.type === 15) && Array.isArray(p.default))
      p.default = Float32Array.from(p.default);
    else if (p.default === void 0) {
      let cloner = p.cloner ?? defaultPropertyCloner;
      p.default = cloner.clone(p.type, _componentDefaults.get(p.type));
    }
    ctor.prototype[name] = p.default;
  }
}
function _setPropertyOrder(ctor) {
  ctor._propertyOrder = ctor.hasOwnProperty("Properties") ? Object.keys(ctor.Properties).sort() : [];
}
var WASM2 = class {
  worker = "";
  wasm = null;
  canvas = null;
  preinitializedWebGPUDevice = null;
  webxr_session = null;
  webxr_requestSession = null;
  webxr_offerSession = null;
  webxr_frame = null;
  webxr_refSpace = null;
  webxr_refSpaces = null;
  webxr_refSpaceType = null;
  webxr_baseLayer = null;
  webxr_framebufferScaleFactor = 1;
  webxr_fbo = 0;
  UTF8ViewToString;
  _log = new Logger();
  _deactivate_component_on_error = false;
  _tempMem = null;
  _tempMemSize = 0;
  _tempMemFloat = null;
  _tempMemInt = null;
  _tempMemUint8 = null;
  _tempMemUint32 = null;
  _tempMemUint16 = null;
  _loadingScreen = null;
  _sceneLoadedCallback = [];
  _images = [null];
  _components = null;
  _componentTypes = [];
  _componentTypeIndices = {};
  _engine = null;
  _withPhysX = false;
  _utf8Decoder = new TextDecoder("utf8");
  _brokenComponentIndex = 0;
  constructor(threads2) {
    threads2 ? this.UTF8ViewToString = (s, e) => s ? this._utf8Decoder.decode(this.HEAPU8.slice(s, e)) : "" : this.UTF8ViewToString = (s, e) => s ? this._utf8Decoder.decode(this.HEAPU8.subarray(s, e)) : "", this._brokenComponentIndex = this._registerComponent(BrokenComponent);
  }
  reset() {
    this._wl_reset(), this._components = null, this._images.length = 1, this.allocateTempMemory(1024), this._componentTypes = [], this._componentTypeIndices = {}, this._brokenComponentIndex = this._registerComponent(BrokenComponent);
  }
  isRegistered(type) {
    return type in this._componentTypeIndices;
  }
  _registerComponentLegacy(typeName, params, object) {
    let ctor = class extends Component3 {
    };
    return ctor.TypeName = typeName, ctor.Properties = params, Object.assign(ctor.prototype, object), this._registerComponent(ctor);
  }
  _registerComponent(ctor) {
    if (!ctor.TypeName)
      throw new Error("no name provided for component.");
    if (!ctor.prototype._triggerInit)
      throw new Error(`registerComponent(): Component ${ctor.TypeName} must extend Component`);
    inheritProperties(ctor), _setupDefaults(ctor), _setPropertyOrder(ctor);
    let typeIndex = ctor.TypeName in this._componentTypeIndices ? this._componentTypeIndices[ctor.TypeName] : this._componentTypes.length;
    return this._componentTypes[typeIndex] = ctor, this._componentTypeIndices[ctor.TypeName] = typeIndex, ctor === BrokenComponent || (this._log.info(0, "Registered component", ctor.TypeName, `(class ${ctor.name})`, "with index", typeIndex), ctor.onRegister && ctor.onRegister(this._engine)), typeIndex;
  }
  allocateTempMemory(size) {
    this._log.info(0, "Allocating temp mem:", size), this._tempMemSize = size, this._tempMem && this._free(this._tempMem), this._tempMem = this._malloc(this._tempMemSize), this.updateTempMemory();
  }
  requireTempMem(size) {
    this._tempMemSize >= size || this.allocateTempMemory(Math.ceil(size / 1024) * 1024);
  }
  updateTempMemory() {
    this._tempMemFloat = new Float32Array(this.HEAP8.buffer, this._tempMem, this._tempMemSize >> 2), this._tempMemInt = new Int32Array(this.HEAP8.buffer, this._tempMem, this._tempMemSize >> 2), this._tempMemUint32 = new Uint32Array(this.HEAP8.buffer, this._tempMem, this._tempMemSize >> 2), this._tempMemUint16 = new Uint16Array(this.HEAP8.buffer, this._tempMem, this._tempMemSize >> 1), this._tempMemUint8 = new Uint8Array(this.HEAP8.buffer, this._tempMem, this._tempMemSize);
  }
  getTempBufferU8(count) {
    return this.requireTempMem(count), this._tempMemUint8;
  }
  getTempBufferU16(count) {
    return this.requireTempMem(count * 2), this._tempMemUint16;
  }
  getTempBufferU32(count) {
    return this.requireTempMem(count * 4), this._tempMemUint32;
  }
  getTempBufferI32(count) {
    return this.requireTempMem(count * 4), this._tempMemInt;
  }
  getTempBufferF32(count) {
    return this.requireTempMem(count * 4), this._tempMemFloat;
  }
  tempUTF8(str2, byteOffset = 0) {
    let strLen = this.lengthBytesUTF8(str2) + 1;
    this.requireTempMem(strLen + byteOffset);
    let ptr = this._tempMem + byteOffset;
    return this.stringToUTF8(str2, ptr, strLen), ptr;
  }
  copyBufferToHeap(buffer) {
    let size = buffer.byteLength, ptr = this._malloc(size);
    return this.HEAPU8.set(new Uint8Array(buffer), ptr), ptr;
  }
  get withPhysX() {
    return this._withPhysX;
  }
  _setEngine(engine2) {
    this._engine = engine2;
  }
  _wljs_xr_session_start(mode) {
    this._engine.xr === null && (this._engine.xr = new XR(this, mode), this._engine.onXRSessionStart.notify(this.webxr_session, mode));
  }
  _wljs_xr_session_end() {
    let startEmitter = this._engine.onXRSessionStart;
    startEmitter instanceof RetainEmitter && startEmitter.reset(), this._engine.onXRSessionEnd.notify(), this._engine.xr = null;
  }
  _wljs_xr_disable() {
    this._engine.arSupported = false, this._engine.vrSupported = false;
  }
  _wljs_init(withPhysX) {
    this._withPhysX = withPhysX, this.allocateTempMemory(1024);
  }
  _wljs_scene_switch(index) {
    let scene = this._engine._scenes[index];
    this._components = scene?._jsComponents ?? null;
  }
  _wljs_destroy_image(index) {
    let img = this._images[index];
    img && (this._images[index] = null, img.src !== void 0 && (img.src = ""), img.onload !== void 0 && (img.onload = null), img.onerror !== void 0 && (img.onerror = null));
  }
  _wljs_objects_markDestroyed(sceneIndex, idsPtr, count) {
    let scene = this._engine._scenes[sceneIndex], start = idsPtr >>> 1;
    for (let i = 0; i < count; ++i) {
      let id = this.HEAPU16[start + i];
      scene._destroyObject(id);
    }
  }
  _wljs_scene_initialize(sceneIndex, idsPtr, idsEnd, paramDataPtr, paramDataEndPtr, offsetsPtr, offsetsEndPtr) {
    let cbor = this.HEAPU8.subarray(paramDataPtr, paramDataEndPtr), offsets = this.HEAPU32.subarray(offsetsPtr >>> 2, offsetsEndPtr >>> 2), ids = this.HEAPU16.subarray(idsPtr >>> 1, idsEnd >>> 1), engine2 = this._engine, scene = engine2._scenes[sceneIndex], components = scene._jsComponents, decoded;
    try {
      decoded = CBOR.decode(cbor);
    } catch (e) {
      this._log.error(0, "Exception during component parameter decoding"), this._log.error(2, e);
      return;
    }
    if (!Array.isArray(decoded)) {
      this._log.error(0, "Parameter data must be an array");
      return;
    }
    if (decoded.length !== ids.length) {
      this._log.error(0, `Parameter data has size ${decoded.length} but expected ${ids.length}`);
      return;
    }
    for (let i = 0; i < decoded.length; ++i) {
      let id = Component3._pack(sceneIndex, ids[i]), index = this._wl_get_js_component_index_for_id(id), component = components[index], ctor = component.constructor;
      if (ctor == BrokenComponent)
        continue;
      let paramNames = ctor._propertyOrder, paramValues = decoded[i];
      if (!Array.isArray(paramValues)) {
        this._log.error(0, "Component parameter data must be an array");
        continue;
      }
      if (paramValues.length !== paramNames.length) {
        this._log.error(0, `Component parameter data has size ${paramValues.length} but expected ${paramNames.length}`);
        continue;
      }
      for (let j = 0; j < paramValues.length; ++j) {
        let name = paramNames[j], property2 = ctor.Properties[name], type = property2.type, value = paramValues[j];
        if (value === void 0) {
          value = (property2.cloner ?? defaultPropertyCloner).clone(type, property2.default), component[name] = value;
          continue;
        }
        switch (typeof value == "number" && (value += offsets[type]), type) {
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
          case 13:
          case 14:
          case 15:
            break;
          case 6:
            value = value ? scene.wrap(this._wl_object_id(scene._index, value)) : null;
            break;
          case 7:
            value = engine2.meshes.wrap(value);
            break;
          case 8:
            value = engine2.textures.wrap(value);
            break;
          case 9:
            value = engine2.materials.wrap(value);
            break;
          case 10:
            value = scene.animations.wrap(value);
            break;
          case 11:
            value = scene.skins.wrap(value);
            break;
          case 12:
            let max2 = (1 << value.BYTES_PER_ELEMENT * 8) - 1;
            value = Float32Array.from(value, (f, _) => f / max2);
            break;
        }
        component[name] = value;
      }
    }
  }
  _wljs_set_component_param_translation(scene, component, param, valuePtr, valueEndPtr) {
    let comp = this._engine._scenes[scene]._jsComponents[component], value = this.UTF8ViewToString(valuePtr, valueEndPtr), paramName = comp.constructor._propertyOrder[param];
    comp[paramName] = value;
  }
  _wljs_get_component_type_index(namePtr, nameEndPtr) {
    let typename = this.UTF8ViewToString(namePtr, nameEndPtr), index = this._componentTypeIndices[typename];
    return index === void 0 ? this._brokenComponentIndex : index;
  }
  _wljs_component_create(sceneIndex, index, id, type, object) {
    this._engine._scenes[sceneIndex]._components.createJs(index, id, type, object);
  }
  _wljs_component_init(scene, component) {
    this._engine._scenes[scene]._jsComponents[component]._triggerInit();
  }
  _wljs_component_update(component, dt) {
    this._components[component]._triggerUpdate(dt);
  }
  _wljs_component_onActivate(component) {
    this._components[component]._triggerOnActivate();
  }
  _wljs_component_onDeactivate(component) {
    this._components[component]._triggerOnDeactivate();
  }
  _wljs_component_markDestroyed(sceneIndex, manager, componentId) {
    this._engine._scenes[sceneIndex]._destroyComponent(manager, componentId);
  }
  _wljs_swap(scene, a, b) {
    let components = this._engine._scenes[scene]._jsComponents, componentA = components[a];
    components[a] = components[b], components[b] = componentA;
  }
  _wljs_copy(srcSceneIndex, srcIndex, dstSceneIndex, dstIndex, offsetsPtr) {
    let srcScene = this._engine._scenes[srcSceneIndex], destComp = this._engine._scenes[dstSceneIndex]._jsComponents[dstIndex], srcComp = srcScene._jsComponents[srcIndex];
    try {
      destComp._copy(srcComp, offsetsPtr);
    } catch (e) {
      this._log.error(2, `Exception during ${destComp.type} copy() on object ${destComp.object.name}`), this._log.error(2, e);
    }
  }
  _wljs_trigger_animationEvent(componentId, namePtr, nameEndPtr) {
    let comp = this._engine.scene._components.wrapAnimation(componentId), nameStr = this.UTF8ViewToString(namePtr, nameEndPtr);
    comp.onEvent.notify(nameStr);
  }
};
function throwInvalidRuntime(version) {
  return function() {
    throw new Error(`Feature added in version ${version}.
	\u2192 Please use a Wonderland Engine editor version >= ${version}`);
  };
}
var requireRuntime1_2_1 = throwInvalidRuntime("1.2.1");
WASM2.prototype._wl_text_component_get_wrapMode = requireRuntime1_2_1;
WASM2.prototype._wl_text_component_set_wrapMode = requireRuntime1_2_1;
WASM2.prototype._wl_text_component_get_wrapWidth = requireRuntime1_2_1;
WASM2.prototype._wl_text_component_set_wrapWidth = requireRuntime1_2_1;
WASM2.prototype._wl_font_get_outlineSize = requireRuntime1_2_1;
WASM2.prototype._wl_scene_create_chunked_start = requireRuntime1_2_1;
WASM2.prototype._wl_scene_create_chunked_buffer_size = requireRuntime1_2_1;
WASM2.prototype._wl_scene_create_chunked_next = requireRuntime1_2_1;
WASM2.prototype._wl_scene_create_chunked_abort = requireRuntime1_2_1;
WASM2.prototype._wl_scene_create_chunked_end_prefab = requireRuntime1_2_1;
WASM2.prototype._wl_scene_create_chunked_end_main = requireRuntime1_2_1;
WASM2.prototype._wl_scene_create_chunked_end_queued = requireRuntime1_2_1;
var requireRuntime1_2_2 = throwInvalidRuntime("1.2.2");
WASM2.prototype._wl_view_component_get_projectionType = requireRuntime1_2_2;
WASM2.prototype._wl_view_component_set_projectionType = requireRuntime1_2_2;
WASM2.prototype._wl_view_component_get_extent = requireRuntime1_2_2;
WASM2.prototype._wl_view_component_set_extent = requireRuntime1_2_2;
WASM2.prototype._wl_animation_component_get_rootMotionMode = requireRuntime1_2_2;
WASM2.prototype._wl_animation_component_set_rootMotionMode = requireRuntime1_2_2;
WASM2.prototype._wl_animation_component_get_rootMotion_translation = requireRuntime1_2_2;
WASM2.prototype._wl_animation_component_get_rootMotion_rotation = requireRuntime1_2_2;
var requireRuntime1_2_3 = throwInvalidRuntime("1.2.3");
WASM2.prototype._wl_scene_environment_set_intensity = requireRuntime1_2_3;
WASM2.prototype._wl_scene_environment_get_intensity = requireRuntime1_2_3;
WASM2.prototype._wl_scene_environment_set_tint = requireRuntime1_2_3;
WASM2.prototype._wl_scene_environment_get_tint = requireRuntime1_2_3;
WASM2.prototype._wl_scene_environment_set_coefficients = requireRuntime1_2_3;
WASM2.prototype._wl_scene_environment_get_coefficients = requireRuntime1_2_3;
WASM2.prototype._wl_animation_component_get_iteration = requireRuntime1_2_3;
WASM2.prototype._wl_animation_component_get_position = requireRuntime1_2_3;
WASM2.prototype._wl_animation_component_get_duration = requireRuntime1_2_3;
WASM2.prototype._wl_renderer_streaming_idle = requireRuntime1_2_3;
var APIVersion = { major: 1, minor: 2, patch: 4, rc: 0 };
var LOADING_SCREEN_PATH = "WonderlandRuntime-LoadingScreen.bin";
function loadScript(scriptURL) {
  return new Promise((res, rej) => {
    let s = document.createElement("script"), node = document.body.appendChild(s);
    s.onload = () => {
      document.body.removeChild(node), res();
    }, s.onerror = (e) => {
      document.body.removeChild(node), rej(e);
    }, s.src = scriptURL;
  });
}
async function detectFeatures() {
  let [simdSupported, threadsSupported] = await Promise.all([simd(), threads()]);
  return simdSupported ? console.log("WASM SIMD is supported") : console.warn("WASM SIMD is not supported"), threadsSupported ? self.crossOriginIsolated ? console.log("WASM Threads is supported") : console.warn("WASM Threads is supported, but the page is not crossOriginIsolated, therefore thread support is disabled.") : console.warn("WASM Threads is not supported"), threadsSupported = threadsSupported && self.crossOriginIsolated, { simdSupported, threadsSupported };
}
var xrSupported = { ar: null, vr: null };
function checkXRSupport2() {
  if (typeof navigator > "u" || !navigator.xr)
    return xrSupported.vr = false, xrSupported.ar = false, Promise.resolve(xrSupported);
  let vrPromise = xrSupported.vr !== null ? Promise.resolve() : navigator.xr.isSessionSupported("immersive-vr").then((supported) => xrSupported.vr = supported).catch(() => xrSupported.vr = false), arPromise = xrSupported.ar !== null ? Promise.resolve() : navigator.xr.isSessionSupported("immersive-ar").then((supported) => xrSupported.ar = supported).catch(() => xrSupported.ar = false);
  return Promise.all([vrPromise, arPromise]).then(() => xrSupported);
}
function checkRuntimeCompatibility(version) {
  let { major, minor } = version, majorDiff = major - APIVersion.major, minorDiff = minor - APIVersion.minor;
  if (!majorDiff && !minorDiff)
    return;
  let error = `checkRuntimeCompatibility(): Version compatibility mismatch:
	\u2192 API and runtime compatibility is enforced on a patch level (versions x.y.*)
`;
  throw majorDiff < 0 || !majorDiff && minorDiff < 0 ? new Error(`${error}	\u2192 Please use a Wonderland Engine editor version >= ${APIVersion.major}.${APIVersion.minor}.*`) : new Error(`${error}	\u2192 Please use a new API version >= ${version.major}.${version.minor}.*`);
}
async function loadRuntime(runtime, options = {}) {
  let xrPromise = checkXRSupport2(), baseURL = getBaseUrl(runtime), { simdSupported, threadsSupported } = await detectFeatures(), { simd: simd2 = simdSupported, threads: threads2 = threadsSupported, webgpu = false, physx = false, loader = false, xrFramebufferScaleFactor = 1, xrOfferSession = null, loadingScreen = baseURL ? `${baseURL}/${LOADING_SCREEN_PATH}` : LOADING_SCREEN_PATH, canvas = "canvas", logs = [0, 1, 2] } = options, variant = [];
  webgpu && variant.push("webgpu"), loader && variant.push("loader"), physx && variant.push("physx"), simd2 && variant.push("simd"), threads2 && variant.push("threads");
  let variantStr = variant.join("-"), filename = runtime;
  variantStr && (filename = `${filename}-${variantStr}`);
  let download = function(filename2, errorMessage) {
    return fetch(filename2).then((r) => r.ok ? r.arrayBuffer() : Promise.reject(errorMessage)).catch((_) => Promise.reject(errorMessage));
  }, [wasmData, loadingScreenData] = await Promise.all([download(`${filename}.wasm`, `Failed to fetch runtime .wasm file: ${filename}`), download(loadingScreen, "Failed to fetch loading screen file")]), canvasElement = document.getElementById(canvas);
  if (!canvasElement)
    throw new Error(`loadRuntime(): Failed to find canvas with id '${canvas}'`);
  if (!(canvasElement instanceof HTMLCanvasElement))
    throw new Error(`loadRuntime(): HTML element '${canvas}' must be a canvas`);
  let wasm = new WASM2(threads2);
  if (wasm.worker = `${filename}.worker.js`, wasm.wasm = wasmData, wasm.canvas = canvasElement, wasm._log.levels.enable(...logs), webgpu) {
    let adapter = await navigator.gpu.requestAdapter(), desc = { requiredFeatures: ["texture-compression-bc"] }, device = await adapter.requestDevice(desc);
    wasm.preinitializedWebGPUDevice = device;
  }
  let engine2 = new WonderlandEngine(wasm, loadingScreenData);
  window._WL || (window._WL = { runtimes: {} });
  let runtimes = window._WL.runtimes, runtimeGlobalId = variantStr || "default";
  runtimes[runtimeGlobalId] || (await loadScript(`${filename}.js`), runtimes[runtimeGlobalId] = window.instantiateWonderlandRuntime, window.instantiateWonderlandRuntime = void 0), await runtimes[runtimeGlobalId](wasm), engine2._init(), checkRuntimeCompatibility(engine2.runtimeVersion);
  let xr = await xrPromise;
  if (engine2.arSupported = xr.ar, engine2.vrSupported = xr.vr, engine2.xrFramebufferScaleFactor = xrFramebufferScaleFactor, engine2.autoResizeCanvas = true, engine2.start(), xrOfferSession !== null) {
    let mode = xrOfferSession.mode;
    mode == "auto" && (engine2.vrSupported ? mode = "immersive-vr" : engine2.arSupported ? mode = "immersive-ar" : mode = "inline");
    let offerSession = function() {
      engine2.offerXRSession(mode, xrOfferSession.features, xrOfferSession.optionalFeatures).then((s) => s.addEventListener("end", offerSession)).catch(console.warn);
    };
    offerSession();
  }
  return engine2;
}

// node_modules/gl-matrix/esm/common.js
var EPSILON = 1e-6;
var ARRAY_TYPE = typeof Float32Array !== "undefined" ? Float32Array : Array;
var RANDOM = Math.random;
var degree = Math.PI / 180;
if (!Math.hypot)
  Math.hypot = function() {
    var y = 0, i = arguments.length;
    while (i--) {
      y += arguments[i] * arguments[i];
    }
    return Math.sqrt(y);
  };

// node_modules/gl-matrix/esm/vec3.js
var vec3_exports = {};
__export(vec3_exports, {
  add: () => add,
  angle: () => angle,
  bezier: () => bezier,
  ceil: () => ceil,
  clone: () => clone,
  copy: () => copy,
  create: () => create,
  cross: () => cross,
  dist: () => dist,
  distance: () => distance,
  div: () => div,
  divide: () => divide,
  dot: () => dot,
  equals: () => equals,
  exactEquals: () => exactEquals,
  floor: () => floor,
  forEach: () => forEach,
  fromValues: () => fromValues,
  hermite: () => hermite,
  inverse: () => inverse,
  len: () => len,
  length: () => length,
  lerp: () => lerp,
  max: () => max,
  min: () => min,
  mul: () => mul,
  multiply: () => multiply,
  negate: () => negate,
  normalize: () => normalize,
  random: () => random,
  rotateX: () => rotateX,
  rotateY: () => rotateY,
  rotateZ: () => rotateZ,
  round: () => round,
  scale: () => scale,
  scaleAndAdd: () => scaleAndAdd,
  set: () => set,
  sqrDist: () => sqrDist,
  sqrLen: () => sqrLen,
  squaredDistance: () => squaredDistance,
  squaredLength: () => squaredLength,
  str: () => str,
  sub: () => sub,
  subtract: () => subtract,
  transformMat3: () => transformMat3,
  transformMat4: () => transformMat4,
  transformQuat: () => transformQuat,
  zero: () => zero
});
function create() {
  var out = new ARRAY_TYPE(3);
  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
  }
  return out;
}
function clone(a) {
  var out = new ARRAY_TYPE(3);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  return out;
}
function length(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  return Math.hypot(x, y, z);
}
function fromValues(x, y, z) {
  var out = new ARRAY_TYPE(3);
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
}
function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  return out;
}
function set(out, x, y, z) {
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
}
function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  return out;
}
function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  return out;
}
function multiply(out, a, b) {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  out[2] = a[2] * b[2];
  return out;
}
function divide(out, a, b) {
  out[0] = a[0] / b[0];
  out[1] = a[1] / b[1];
  out[2] = a[2] / b[2];
  return out;
}
function ceil(out, a) {
  out[0] = Math.ceil(a[0]);
  out[1] = Math.ceil(a[1]);
  out[2] = Math.ceil(a[2]);
  return out;
}
function floor(out, a) {
  out[0] = Math.floor(a[0]);
  out[1] = Math.floor(a[1]);
  out[2] = Math.floor(a[2]);
  return out;
}
function min(out, a, b) {
  out[0] = Math.min(a[0], b[0]);
  out[1] = Math.min(a[1], b[1]);
  out[2] = Math.min(a[2], b[2]);
  return out;
}
function max(out, a, b) {
  out[0] = Math.max(a[0], b[0]);
  out[1] = Math.max(a[1], b[1]);
  out[2] = Math.max(a[2], b[2]);
  return out;
}
function round(out, a) {
  out[0] = Math.round(a[0]);
  out[1] = Math.round(a[1]);
  out[2] = Math.round(a[2]);
  return out;
}
function scale(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  return out;
}
function scaleAndAdd(out, a, b, scale2) {
  out[0] = a[0] + b[0] * scale2;
  out[1] = a[1] + b[1] * scale2;
  out[2] = a[2] + b[2] * scale2;
  return out;
}
function distance(a, b) {
  var x = b[0] - a[0];
  var y = b[1] - a[1];
  var z = b[2] - a[2];
  return Math.hypot(x, y, z);
}
function squaredDistance(a, b) {
  var x = b[0] - a[0];
  var y = b[1] - a[1];
  var z = b[2] - a[2];
  return x * x + y * y + z * z;
}
function squaredLength(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  return x * x + y * y + z * z;
}
function negate(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  return out;
}
function inverse(out, a) {
  out[0] = 1 / a[0];
  out[1] = 1 / a[1];
  out[2] = 1 / a[2];
  return out;
}
function normalize(out, a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var len2 = x * x + y * y + z * z;
  if (len2 > 0) {
    len2 = 1 / Math.sqrt(len2);
  }
  out[0] = a[0] * len2;
  out[1] = a[1] * len2;
  out[2] = a[2] * len2;
  return out;
}
function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
function cross(out, a, b) {
  var ax = a[0], ay = a[1], az = a[2];
  var bx = b[0], by = b[1], bz = b[2];
  out[0] = ay * bz - az * by;
  out[1] = az * bx - ax * bz;
  out[2] = ax * by - ay * bx;
  return out;
}
function lerp(out, a, b, t) {
  var ax = a[0];
  var ay = a[1];
  var az = a[2];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  out[2] = az + t * (b[2] - az);
  return out;
}
function hermite(out, a, b, c, d, t) {
  var factorTimes2 = t * t;
  var factor1 = factorTimes2 * (2 * t - 3) + 1;
  var factor2 = factorTimes2 * (t - 2) + t;
  var factor3 = factorTimes2 * (t - 1);
  var factor4 = factorTimes2 * (3 - 2 * t);
  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
  return out;
}
function bezier(out, a, b, c, d, t) {
  var inverseFactor = 1 - t;
  var inverseFactorTimesTwo = inverseFactor * inverseFactor;
  var factorTimes2 = t * t;
  var factor1 = inverseFactorTimesTwo * inverseFactor;
  var factor2 = 3 * t * inverseFactorTimesTwo;
  var factor3 = 3 * factorTimes2 * inverseFactor;
  var factor4 = factorTimes2 * t;
  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
  return out;
}
function random(out, scale2) {
  scale2 = scale2 || 1;
  var r = RANDOM() * 2 * Math.PI;
  var z = RANDOM() * 2 - 1;
  var zScale = Math.sqrt(1 - z * z) * scale2;
  out[0] = Math.cos(r) * zScale;
  out[1] = Math.sin(r) * zScale;
  out[2] = z * scale2;
  return out;
}
function transformMat4(out, a, m) {
  var x = a[0], y = a[1], z = a[2];
  var w = m[3] * x + m[7] * y + m[11] * z + m[15];
  w = w || 1;
  out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
  out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
  out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
  return out;
}
function transformMat3(out, a, m) {
  var x = a[0], y = a[1], z = a[2];
  out[0] = x * m[0] + y * m[3] + z * m[6];
  out[1] = x * m[1] + y * m[4] + z * m[7];
  out[2] = x * m[2] + y * m[5] + z * m[8];
  return out;
}
function transformQuat(out, a, q) {
  var qx = q[0], qy = q[1], qz = q[2], qw = q[3];
  var x = a[0], y = a[1], z = a[2];
  var uvx = qy * z - qz * y, uvy = qz * x - qx * z, uvz = qx * y - qy * x;
  var uuvx = qy * uvz - qz * uvy, uuvy = qz * uvx - qx * uvz, uuvz = qx * uvy - qy * uvx;
  var w2 = qw * 2;
  uvx *= w2;
  uvy *= w2;
  uvz *= w2;
  uuvx *= 2;
  uuvy *= 2;
  uuvz *= 2;
  out[0] = x + uvx + uuvx;
  out[1] = y + uvy + uuvy;
  out[2] = z + uvz + uuvz;
  return out;
}
function rotateX(out, a, b, rad) {
  var p = [], r = [];
  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2];
  r[0] = p[0];
  r[1] = p[1] * Math.cos(rad) - p[2] * Math.sin(rad);
  r[2] = p[1] * Math.sin(rad) + p[2] * Math.cos(rad);
  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];
  return out;
}
function rotateY(out, a, b, rad) {
  var p = [], r = [];
  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2];
  r[0] = p[2] * Math.sin(rad) + p[0] * Math.cos(rad);
  r[1] = p[1];
  r[2] = p[2] * Math.cos(rad) - p[0] * Math.sin(rad);
  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];
  return out;
}
function rotateZ(out, a, b, rad) {
  var p = [], r = [];
  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2];
  r[0] = p[0] * Math.cos(rad) - p[1] * Math.sin(rad);
  r[1] = p[0] * Math.sin(rad) + p[1] * Math.cos(rad);
  r[2] = p[2];
  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];
  return out;
}
function angle(a, b) {
  var ax = a[0], ay = a[1], az = a[2], bx = b[0], by = b[1], bz = b[2], mag1 = Math.sqrt(ax * ax + ay * ay + az * az), mag2 = Math.sqrt(bx * bx + by * by + bz * bz), mag = mag1 * mag2, cosine = mag && dot(a, b) / mag;
  return Math.acos(Math.min(Math.max(cosine, -1), 1));
}
function zero(out) {
  out[0] = 0;
  out[1] = 0;
  out[2] = 0;
  return out;
}
function str(a) {
  return "vec3(" + a[0] + ", " + a[1] + ", " + a[2] + ")";
}
function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}
function equals(a, b) {
  var a0 = a[0], a1 = a[1], a2 = a[2];
  var b0 = b[0], b1 = b[1], b2 = b[2];
  return Math.abs(a0 - b0) <= EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON * Math.max(1, Math.abs(a2), Math.abs(b2));
}
var sub = subtract;
var mul = multiply;
var div = divide;
var dist = distance;
var sqrDist = squaredDistance;
var len = length;
var sqrLen = squaredLength;
var forEach = function() {
  var vec = create();
  return function(a, stride, offset, count, fn, arg) {
    var i, l;
    if (!stride) {
      stride = 3;
    }
    if (!offset) {
      offset = 0;
    }
    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }
    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      vec[2] = a[i + 2];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
      a[i + 2] = vec[2];
    }
    return a;
  };
}();

// js/camera-controller.js
var isDragging = false;
var lastMousePosition = { x: 0, y: 0 };
var tempVec = vec3_exports.create();
var cameraController;
var CameraController = class extends Component3 {
  start() {
    cameraController = this;
    this.camera = this.object.getComponent(ViewComponent);
    if (this.camera.projectionType === ProjectionType.Orthographic) {
      this.extent = this.camera.extent;
    } else {
      this.object.getPositionLocal(tempVec);
      this.extent = tempVec[2];
    }
    window.addEventListener("wheel", this.handleScroll.bind(this));
    window.addEventListener("mousedown", this.handleMouseDown.bind(this));
    window.addEventListener("mousemove", this.handleMouseMove.bind(this));
    window.addEventListener("mouseup", this.handleMouseUp.bind(this));
    window.addEventListener("contextmenu", (e) => e.preventDefault());
  }
  setPositionAbovePlayer(player) {
    player.getPositionWorld(tempVec);
    tempVec[1] = 20;
    tempVec[2] += 10;
    this.object.parent.setPositionWorld(tempVec);
    this.object.getPositionLocal(tempVec);
    this.extent = tempVec[2];
  }
  handleScroll(event) {
    const deltaY = event.deltaY;
    const scrollAmount = deltaY;
    this.extent += scrollAmount / 100;
    if (this.camera.projectionType === ProjectionType.Orthographic) {
      this.extent = Math.min(40, Math.max(20, this.extent));
      this.camera.extent = this.extent;
    } else {
      this.object.getPositionLocal(tempVec);
      this.extent = Math.min(20, Math.max(0, this.extent));
      console.log("e", this.extent);
      tempVec[2] = this.extent;
      this.object.setPositionLocal(tempVec);
    }
  }
  handleMouseDown(event) {
    event.preventDefault();
    isDragging = true;
    lastMousePosition = {
      x: event.clientX,
      y: event.clientY
    };
    document.body.style.cursor = "grabbing";
  }
  handleMouseMove(event) {
    if (!isDragging)
      return;
    const deltaX = event.clientX - lastMousePosition.x;
    const deltaY = event.clientY - lastMousePosition.y;
    tempVec[0] = -deltaX * 0.05;
    tempVec[1] = 0;
    tempVec[2] = -deltaY * 0.05;
    this.object.parent.translateWorld(tempVec);
    lastMousePosition = {
      x: event.clientX,
      y: event.clientY
    };
  }
  handleMouseUp(event) {
    event.preventDefault();
    isDragging = false;
    document.body.style.cursor = "unset";
  }
  update(dt) {
  }
};
__publicField(CameraController, "TypeName", "camera-controller");

// js/utils.js
function setHierarchyActive(object, b) {
  object.active = b;
  const children = object.children;
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    setHierarchyActive(child, b);
  }
}

// js/scene-parser.js
var UP = [0, 1, 0];
var testString = `
################################
#A.oooooooooooooooooooooooooo.B#
#..............................#
#o............................o#
#o..0......................1..o#
#o............................o#
#o............................o#
#o............................o#
#o............................o#
#o............................o#
#o............................o#
#o............................o#
#o............................o#
#o............................o#
#o............................o#
#o.............OO.............o#
#o.............OO.............o#
#o............................o#
#o............................o#
#o............................o#
#o............................o#
#o............................o#
#o............................o#
#o............................o#
#o............................o#
#o............................o#
#o............................o#
#o..2......................3..o#
#o............................o#
#..............................#
#C.oooooooooooooooooooooooooo.D#
################################
`;
var characterRegistry = {
  wall: "#",
  floor: ".",
  switch: ["A", "B", "C", "D", "E", "F", "G", "H"],
  oxygen: "o",
  spawnPoint: ["0", "1", "2", "3", "4", "5", "6", "7"],
  exit: "O"
};
var currentPlayerSpawnPositions = [
  vec3_exports.create(),
  vec3_exports.create(),
  vec3_exports.create(),
  vec3_exports.create()
];
var characterRegistryKeys = Object.keys(characterRegistry);
var startingXPosition = -32;
var startingZPosition = -32;
var gridWidth = 2;
function isNewLine(char) {
  return char === "\n" || char === "\r";
}
var tempVec2 = vec3_exports.create();
var sceneParser;
var SceneParser = class extends Component3 {
  init() {
    sceneParser = this;
    this.map = null;
  }
  start() {
    if (this.debug) {
      this.setupLevel(testString);
    }
  }
  setupLevel(mapString) {
    this.spawnLevel(mapString);
    playerController.initializePlayers();
  }
  cleanLevel() {
    this.currentLevelAsssetContainer.destroy();
    this.map = null;
  }
  getAssetPrototypeFromCharacter(char) {
    for (let i = 0; i < characterRegistryKeys.length; i++) {
      const key = characterRegistryKeys[i];
      const value = characterRegistry[key];
      if (value instanceof String && char === value) {
        return this[key + "Prototype"];
      } else {
        for (let j = 0; j < value.length; j++) {
          const currentValueChar = value[j];
          if (char === currentValueChar) {
            return this[key + "Prototype"];
          }
        }
      }
    }
  }
  checkCharacterLogic(char, position, object) {
    for (let i = 0; i < characterRegistryKeys.length; i++) {
      const key = characterRegistryKeys[i];
      const value = characterRegistry[key];
      if (char === value) {
        switch (char) {
          case characterRegistry.wall:
            object.rotateAxisAngleDegLocal(UP, Math.random() * 360);
            return;
          case characterRegistry.floor:
            return;
          case characterRegistry.oxygen:
            object.rotateAxisAngleDegLocal(UP, Math.random() * 360);
            return;
          case characterRegistry.exit:
            return;
        }
      } else {
        if (characterRegistry.switch.includes(char)) {
          return;
        } else if (characterRegistry.spawnPoint.includes(char)) {
          const spawnPointPositionIndex = characterRegistry.spawnPoint.indexOf(char);
          vec3_exports.copy(currentPlayerSpawnPositions[spawnPointPositionIndex], position);
          return;
        }
      }
    }
  }
  removeTile(x, y) {
    this.map[y][x].object.destroy();
    this.map[y][x] = null;
  }
  spawnTile(x, y, char) {
    if (this.map[y][x])
      this.removeTile(x, y);
    const asset = this.getAssetPrototypeFromCharacter(char);
    const newAsset = asset.clone(this.currentLevelAsssetContainer);
    tempVec2[0] = startingXPosition + gridWidth * x;
    tempVec2[2] = startingZPosition + gridWidth * y;
    this.checkCharacterLogic(char, tempVec2, newAsset);
    newAsset.setPositionWorld(tempVec2);
    this.map[y][x] = {
      object: newAsset,
      char
    };
  }
  spawnLevel(levelString) {
    this.currentLevelAsssetContainer = this.object.addChild();
    let x = 0;
    let y = 0;
    this.map = [[]];
    for (const char of levelString) {
      if (isNewLine(char)) {
        this.map.push([]);
        y++;
        x = 0;
      } else {
        this.map[y].push(null);
        x++;
        this.spawnTile(x, y, char);
      }
    }
  }
};
__publicField(SceneParser, "TypeName", "scene-parser");
__publicField(SceneParser, "Properties", {
  wallPrototype: Property.object(),
  floorPrototype: Property.object(),
  switchPrototype: Property.object(),
  oxygenPrototype: Property.object(),
  spawnPointPrototype: Property.object(),
  exitPrototype: Property.object(),
  debug: Property.bool(true)
});

// js/player-controller.js
var ROTATION_DIRECTIONS = {
  up: 180,
  down: 0,
  right: 90,
  left: 270
};
function movementDirectionToString(moveDirectionX, moveDirectionZ) {
  if (moveDirectionX > 0)
    return "D";
  else if (moveDirectionX < 0)
    return "A";
  else if (moveDirectionZ > 0)
    return "S";
  else if (moveDirectionZ < 0)
    return "W";
}
var ACTIVE_PLAYER_COUNT = 4;
var activePlayerLerpTime = [];
for (let i = 0; i < ACTIVE_PLAYER_COUNT; i++) {
  activePlayerLerpTime.push(0);
}
var activePlayerPositions = {
  0: { isMoving: false, startPosition: vec3_exports.create(), targetPosition: vec3_exports.create() },
  1: { isMoving: false, startPosition: vec3_exports.create(), targetPosition: vec3_exports.create() },
  2: { isMoving: false, startPosition: vec3_exports.create(), targetPosition: vec3_exports.create() },
  3: { isMoving: false, startPosition: vec3_exports.create(), targetPosition: vec3_exports.create() }
};
var tempVec3 = vec3_exports.create();
var playerController;
var PlayerController = class extends Component3 {
  init() {
    playerController = this;
    this.playerObjects = [...this.object.children];
  }
  start() {
    this.registerKeyboardInput();
  }
  setCameraPositionFromPlayerIndex(playerIndex) {
    cameraController.setPositionAbovePlayer(this.currentSelectedPlayerObjects[playerIndex]);
  }
  registerNetworkEvents() {
    gameManager.ws.onMessage("ENTITY_MOVED", this.handleNetworkMove.bind(this));
    gameManager.ws.onMessage("ENTITY_WON", this.handleGameWon.bind(this));
    gameManager.ws.onMessage("OXYGEN_CHANGED", this.handleOxygenChaned.bind(this));
    gameManager.ws.onMessage("PLAYER_JOINED", this.handlePlayerJoined.bind(this));
    gameManager.ws.onMessage("PLAYER_LEFT", this.handlePlayerLeft.bind(this));
  }
  setNetworkPlayersActive(entities) {
    const entityIds = Object.keys(entities);
    for (let i = 0; i < entityIds.length; i++) {
      const positions = entities[entityIds[i]];
      tempVec3[0] = gridWidth * 1 + startingXPosition + gridWidth * positions.x;
      tempVec3[1] = 0;
      tempVec3[2] = startingZPosition + gridWidth * positions.y;
      const id = entityIds[i];
      const index = Number(id);
      this.currentSelectedPlayerObjects[index].setPositionLocal(tempVec3);
      setHierarchyActive(this.currentSelectedPlayerObjects[index], true);
    }
  }
  handlePlayerJoined(data) {
    const { entityId } = data;
    const index = Number(entityId);
    setHierarchyActive(this.currentSelectedPlayerObjects[index], true);
  }
  handlePlayerLeft(data) {
    const { entityId } = data;
    const index = Number(entityId);
    setHierarchyActive(this.currentSelectedPlayerObjects[index], false);
  }
  handleOxygenChaned(data) {
    const { oxygen, oxygenMax } = data;
    setHealth(100 * (oxygen / oxygenMax));
  }
  handleNetworkMove(data) {
    const { oldX, oldY, newX, newY, entityId } = data;
    const playerIndex = Number(entityId);
    if (newX > oldX)
      this.movePlayer(playerIndex, 1 * gridWidth, 0);
    else if (newX < oldX)
      this.movePlayer(playerIndex, -1 * gridWidth, 0);
    else if (newY > oldY)
      this.movePlayer(playerIndex, 0, 1 * gridWidth);
    else if (newY < oldY)
      this.movePlayer(playerIndex, 0, -1 * gridWidth);
    const arrow = document.getElementById("arrow");
    arrow.classList.remove("active");
  }
  handleGameWon(data) {
    const { entityId } = data;
    endGame(entityId);
  }
  registerKeyboardInput() {
    document.addEventListener("keydown", (event) => {
      if (activePlayerPositions[0].isMoving)
        return;
      switch (event.key) {
        case "ArrowUp":
        case "w":
        case "W":
          this.handleMovement(0, 0, -1 * gridWidth);
          break;
        case "ArrowDown":
        case "s":
        case "S":
          this.handleMovement(0, 0, 1 * gridWidth);
          break;
        case "ArrowLeft":
        case "A":
        case "a":
          this.handleMovement(0, -1 * gridWidth, 0);
          break;
        case "ArrowRight":
        case "D":
        case "d":
          this.handleMovement(0, 1 * gridWidth, 0);
          break;
      }
    });
  }
  handleMovement(playerIndex, moveDirectionX, moveDirectionZ) {
    if (sceneParser.debug) {
      this.movePlayer(playerIndex, moveDirectionX, moveDirectionZ);
    } else {
      gameManager.sendMovement(movementDirectionToString(moveDirectionX, moveDirectionZ));
    }
  }
  movePlayer(playerIndex, moveDirectionX, moveDirectionZ) {
    const player = this.currentSelectedPlayerObjects[playerIndex];
    player.getPositionLocal(activePlayerPositions[playerIndex].startPosition);
    player.getPositionLocal(activePlayerPositions[playerIndex].targetPosition);
    vec3_exports.set(tempVec3, moveDirectionX, 0, moveDirectionZ);
    vec3_exports.add(activePlayerPositions[playerIndex].targetPosition, activePlayerPositions[playerIndex].targetPosition, tempVec3);
    activePlayerLerpTime[playerIndex] = 0;
    activePlayerPositions[playerIndex].isMoving = true;
    player.resetRotation();
    player.rotateAxisAngleDegLocal([0, 1, 0], this.getPlayerRotationAngleFromDirection(moveDirectionX, moveDirectionZ));
  }
  getPlayerRotationAngleFromDirection(moveDirectionX, moveDirectionZ) {
    if (moveDirectionX > 0)
      return ROTATION_DIRECTIONS.right;
    else if (moveDirectionX < 0)
      return ROTATION_DIRECTIONS.left;
    else if (moveDirectionZ > 0)
      return ROTATION_DIRECTIONS.down;
    else if (moveDirectionZ < 0)
      return ROTATION_DIRECTIONS.up;
  }
  initializePlayers() {
    this.currentSelectedPlayerObjects = this.getSelectedPlayers();
    for (let i = 0; i < this.currentSelectedPlayerObjects.length; i++) {
      const playerObject = this.currentSelectedPlayerObjects[i];
      const position = currentPlayerSpawnPositions[i];
      playerObject.setPositionLocal(position);
    }
  }
  getSelectedPlayers() {
    if (this.playerObjects.length < ACTIVE_PLAYER_COUNT)
      throw console.error("player-controller: More children on object are required");
    const randomIndices = [];
    const playerObjects = [];
    while (randomIndices.length < ACTIVE_PLAYER_COUNT) {
      let newIndex = Math.floor(Math.random() * this.playerObjects.length);
      while (randomIndices.includes(newIndex)) {
        newIndex = Math.floor(Math.random() * this.playerObjects.length);
      }
      randomIndices.push(newIndex);
    }
    for (let i = 0; i < this.playerObjects.length; i++) {
      const playerObject = this.playerObjects[i];
      if (randomIndices.includes(i)) {
        setHierarchyActive(playerObject, false);
        playerObjects.push(playerObject);
      } else {
        setHierarchyActive(playerObject, false);
      }
    }
    return playerObjects;
  }
  update(dt) {
    for (let i = 0; i < ACTIVE_PLAYER_COUNT; i++) {
      if (activePlayerPositions[i].isMoving) {
        activePlayerLerpTime[i] += dt * this.playerMovementSpeed;
        if (activePlayerLerpTime[i] >= 1) {
          activePlayerLerpTime[i] = 1;
          activePlayerPositions[i].isMoving = false;
        }
        vec3_exports.lerp(tempVec3, activePlayerPositions[i].startPosition, activePlayerPositions[i].targetPosition, activePlayerLerpTime[i]);
        this.currentSelectedPlayerObjects[i].setPositionLocal(tempVec3);
      }
    }
  }
};
__publicField(PlayerController, "TypeName", "player-controller");
__publicField(PlayerController, "Properties", {
  playerMovementSpeed: Property.float(5)
});

// js/networking.js
var WebSocketClient = class {
  constructor(url) {
    this.url = url;
    this.ws = null;
    this.messageHandlers = /* @__PURE__ */ new Map();
    this.connect();
    this.connectedToGame = false;
  }
  connect() {
    this.ws = new WebSocket(this.url);
    this.ws.onopen = () => {
      console.log("Connected to server");
      const urlParams = new URLSearchParams(window.location.search);
      const roomId = urlParams.get("roomId");
      this.send({ command: "CONNECT", roomId: roomId || "1337" });
    };
    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const events = message.events;
      if (!this.connectedToGame) {
        this.connectedToGame = true;
        sceneParser.setupLevel(message.map);
        playerController.setNetworkPlayersActive(message.entities);
        playerController.setCameraPositionFromPlayerIndex(message.player);
        startGame();
      }
      for (let i = 0; i < events.length; i++) {
        const event2 = events[i];
        if (event2.type === "MAP_CHANGED") {
          sceneParser.cleanLevel();
          sceneParser.setupLevel(message.map);
          playerController.setCameraPositionFromPlayerIndex(message.player);
          startGame();
        } else {
          const handler = this.messageHandlers.get(event2.type);
          if (handler) {
            handler(event2);
          }
        }
      }
    };
    this.ws.onclose = () => {
      console.log("Disconnected from server");
    };
    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  }
  send(data) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.warn("WebSocket is not connected");
    }
  }
  onMessage(command, handler) {
    this.messageHandlers.set(command, handler);
  }
  close() {
    if (this.ws) {
      this.ws.close();
    }
  }
};

// js/game-manager.js
var gameManager;
var GameManager = class extends Component3 {
  init() {
    gameManager = this;
    window.gameManager = this;
  }
  joinGame() {
    if (this.ws)
      return;
    this.ws = new WebSocketClient("wss://ggj-2025.onrender.com");
    playerController.registerNetworkEvents();
    this.registerNetworkEvents();
  }
  registerNetworkEvents() {
    this.ws.onMessage("COUNTDOWN", this.handleCountdown.bind(this));
    this.ws.onMessage("TILE_CHANGED", this.handleTileChanged.bind(this));
    this.ws.onMessage("ENTITY_ATTACKED", this.handleEntityAttacked.bind(this));
    this.ws.onMessage("ENTITY_HIT", this.handleEntityHit.bind(this));
  }
  handleCountdown(data) {
    const { countdown } = data;
    const countdownEl = document.querySelector("#countdown");
    countdownEl.innerText = countdown;
  }
  handleTileChanged(data) {
    const { oldTile, newTile, tileX, tileY } = data;
    sceneParser.removeTile(tileX + 1, tileY);
    sceneParser.spawnTile(tileX + 1, tileY, newTile);
  }
  handleEntityAttacked(data) {
    const { entity } = data;
  }
  handleEntityHit(data) {
    const { entity } = data;
  }
  disconnect() {
    this.ws.close();
  }
  sendMovement(dir) {
    if (!this.ws)
      return console.error("game-manager: Can't move, server not joined");
    this.ws.send({ command: "ACTION", action: dir });
  }
};
__publicField(GameManager, "TypeName", "game-manager");
/* Properties that are configurable in the editor */
__publicField(GameManager, "Properties", {
  param: Property.float(1)
});

// js/index.js
var Constants = {
  ProjectName: "ggj2025",
  RuntimeBaseName: "WonderlandRuntime",
  WebXRRequiredFeatures: ["local"],
  WebXROptionalFeatures: ["local", "hand-tracking", "hit-test"]
};
var RuntimeOptions = {
  physx: false,
  loader: false,
  xrFramebufferScaleFactor: 1,
  xrOfferSession: {
    mode: "auto",
    features: Constants.WebXRRequiredFeatures,
    optionalFeatures: Constants.WebXROptionalFeatures
  },
  canvas: "canvas"
};
var engine = await loadRuntime(Constants.RuntimeBaseName, RuntimeOptions);
engine.onLoadingScreenEnd.once(() => {
  const el = document.getElementById("version");
  if (el)
    setTimeout(() => el.remove(), 2e3);
});
function requestSession(mode) {
  engine.requestXRSession(mode, Constants.WebXRRequiredFeatures, Constants.WebXROptionalFeatures).catch((e) => console.error(e));
}
function setupButtonsXR() {
  const arButton = document.getElementById("ar-button");
  if (arButton) {
    arButton.setAttribute("data-supported", engine.arSupported.toString());
    arButton.addEventListener("click", () => requestSession("immersive-ar"));
  }
  const vrButton = document.getElementById("vr-button");
  if (vrButton) {
    vrButton.setAttribute("data-supported", engine.vrSupported.toString());
    vrButton.addEventListener("click", () => requestSession("immersive-vr"));
  }
}
if (document.readyState === "loading") {
  window.addEventListener("load", setupButtonsXR);
} else {
  setupButtonsXR();
}
engine.registerComponent(CameraController);
engine.registerComponent(GameManager);
engine.registerComponent(PlayerController);
engine.registerComponent(SceneParser);
try {
  await engine.loadMainScene(`${Constants.ProjectName}.bin`);
} catch (e) {
  console.error(e);
  window.alert(`Failed to load ${Constants.ProjectName}.bin:`, e);
}
//# sourceMappingURL=ggj2025-bundle.js.map
